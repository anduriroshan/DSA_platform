"""Application configuration settings."""

from pathlib import Path

# Base directory
BASE_DIR = Path(__file__).resolve().parent

# Database
DATABASE_URL = f"sqlite:///{BASE_DIR / 'dsa_platform.db'}"

# CORS
ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://localhost:3000",
]

# Code execution
CODE_EXECUTION_TIMEOUT_SECONDS = 5
MAX_CODE_LENGTH = 10_000  # characters

# Dangerous imports to block
BLOCKED_IMPORTS = [
    "os",
    "sys",
    "subprocess",
    "shutil",
    "pathlib",
    "importlib",
    "ctypes",
    "socket",
    "http",
    "urllib",
    "requests",
    "signal",
    "multiprocessing",
    "threading",
    "_thread",
    "pickle",
    "shelve",
    "marshal",
    "builtins",
    "code",
    "codeop",
    "compile",
    "compileall",
    "eval",
    "exec",
    "execfile",
]
