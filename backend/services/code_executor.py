"""Sandboxed Python code execution service using subprocess."""

import subprocess
import sys
import time
import tempfile
import os
import json
from typing import Tuple

from config import CODE_EXECUTION_TIMEOUT_SECONDS, BLOCKED_IMPORTS


def _build_wrapper_script(user_code_path: str, json_out_path: str) -> str:
    """Build a Python script that sets up tracing and executes the user code."""
    blocked_list = ", ".join(f'"{mod}"' for mod in BLOCKED_IMPORTS)
    return f"""
import sys
import json
import builtins
import atexit

# 1. Import Guard
_original_import = builtins.__import__
_BLOCKED = [{blocked_list}]

def _safe_import(name, *args, **kwargs):
    base_module = name.split('.')[0]
    if base_module in _BLOCKED:
        raise ImportError(f"Import of '{{name}}' is not allowed for security reasons.")
    return _original_import(name, *args, **kwargs)

builtins.__import__ = _safe_import

# 2. DSA SDK
class DSA_SDK:
    def __init__(self):
        self.current_array = []
        self.current_indices = []
        self.current_type = 'highlight'
        self.current_desc = ''

    def track(self, arr):
        self.current_array = list(arr)
        
    def highlight(self, indices, desc=""):
        self.current_indices = indices
        self.current_type = 'highlight'
        self.current_desc = desc

    def compare(self, i, j, desc=""):
        self.current_indices = [i, j]
        self.current_type = 'compare'
        self.current_desc = desc

    def swap(self, i, j, desc=""):
        self.current_indices = [i, j]
        self.current_type = 'swap'
        self.current_desc = desc
        
    def complete(self, desc=""):
        self.current_indices = list(range(len(self.current_array)))
        self.current_type = 'complete'
        self.current_desc = desc

dsa = DSA_SDK()
builtins.dsa = dsa

# 3. Tracer
_dsa_frames = []
def _dsa_trace_lines(frame, event, arg):
    if event != 'line':
        return _dsa_trace_lines
    
    # We only trace lines executed in the user's file
    if frame.f_code.co_filename != r"{user_code_path}":
        return _dsa_trace_lines
        
    arr_state = list(dsa.current_array)
    indices = list(dsa.current_indices)
    
    # 1. Auto-Array Detection
    if not arr_state:
        for k, v in frame.f_locals.items():
            if isinstance(v, list) and all(isinstance(x, (int, float)) for x in v):
                arr_state = list(v)
                break
                
    # 2. Auto-Pointer Detection
    if not indices and arr_state:
        max_idx = max(len(arr_state), 100)
        for k, v in frame.f_locals.items():
            if isinstance(v, int) and not isinstance(v, bool):
                if 0 <= v <= max_idx:
                    indices.append(v)
        
    _dsa_frames.append({{
        "type": dsa.current_type,
        "arrayState": arr_state,
        "indices": indices,
        "description": dsa.current_desc,
        "codeLineHighlight": frame.f_lineno
    }})
    
    # Reset type after recording so it defaults back to highlight
    dsa.current_type = 'highlight'
    dsa.current_desc = ''
    return _dsa_trace_lines

def _dsa_save_frames():
    with open(r"{json_out_path}", "w") as f:
        json.dump(_dsa_frames, f)

atexit.register(_dsa_save_frames)

# 4. Execute User Code
sys.settrace(_dsa_trace_lines)

with open(r"{user_code_path}", "r", encoding="utf-8") as f:
    _code = f.read()

try:
    _compiled = compile(_code, r"{user_code_path}", 'exec')
    # Run in current global scope so builtins are accessible
    exec(_compiled, globals())
finally:
    sys.settrace(None)
"""


def execute_python_code(code: str, stdin: str = "") -> dict:
    """
    Execute Python code in an isolated subprocess.

    Args:
        code: Python source code to execute.
        stdin: Optional string to provide as stdin.

    Returns:
        Dictionary with stdout, stderr, exit_code, execution_time_ms, error, and frames.
    """
    tmp_user_code = None
    tmp_wrapper = None
    tmp_json_out = None
    
    try:
        # Create temp file for user code
        fd1, tmp_user_code = tempfile.mkstemp(suffix=".py", text=True)
        with os.fdopen(fd1, "w", encoding="utf-8") as f:
            f.write(code)
            
        # Create temp file for json trace output
        fd2, tmp_json_out = tempfile.mkstemp(suffix=".json", text=True)
        os.close(fd2)  # Just need the path, script will write to it
        
        # Create wrapper script
        wrapper_code = _build_wrapper_script(tmp_user_code, tmp_json_out)
        fd3, tmp_wrapper = tempfile.mkstemp(suffix=".py", text=True)
        with os.fdopen(fd3, "w", encoding="utf-8") as f:
            f.write(wrapper_code)

        start_time = time.perf_counter()

        result = subprocess.run(
            [sys.executable, tmp_wrapper],
            input=stdin,
            capture_output=True,
            text=True,
            timeout=CODE_EXECUTION_TIMEOUT_SECONDS,
            cwd=tempfile.gettempdir(),
        )

        elapsed_ms = (time.perf_counter() - start_time) * 1000
        
        # Read the generated frames
        frames = []
        if os.path.exists(tmp_json_out):
            try:
                with open(tmp_json_out, "r", encoding="utf-8") as f:
                    content = f.read()
                    if content.strip():
                        frames = json.loads(content)
            except Exception as e:
                pass

        return {
            "stdout": result.stdout,
            "stderr": result.stderr,
            "exit_code": result.returncode,
            "execution_time_ms": round(elapsed_ms, 2),
            "error": None,
            "frames": frames,
        }

    except subprocess.TimeoutExpired:
        elapsed_ms = CODE_EXECUTION_TIMEOUT_SECONDS * 1000
        return {
            "stdout": "",
            "stderr": "",
            "exit_code": -1,
            "execution_time_ms": elapsed_ms,
            "error": f"Execution timed out after {CODE_EXECUTION_TIMEOUT_SECONDS} seconds.",
            "frames": [],
        }

    except Exception as e:
        return {
            "stdout": "",
            "stderr": str(e),
            "exit_code": -1,
            "execution_time_ms": 0,
            "error": f"Execution failed: {str(e)}",
            "frames": [],
        }

    finally:
        # Clean up temporary files
        for p in [tmp_user_code, tmp_wrapper, tmp_json_out]:
            if p and os.path.exists(p):
                try:
                    os.remove(p)
                except OSError:
                    pass
