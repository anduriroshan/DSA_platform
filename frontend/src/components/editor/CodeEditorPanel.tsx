import { useState, useCallback, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { useVisualizerStore } from '../../store/useVisualizerStore';

const API_BASE = 'http://localhost:8000';

export default function CodeEditorPanel() {
  const {
    currentAlgorithm,
    setOutput,
    setIsRunning,
    isRunning,
    setFrames,
    output,
    outputType,
  } = useVisualizerStore();

  const [code, setCode] = useState('Loading starter code...');

  const handleRun = useCallback(async () => {
    setIsRunning(true);
    setOutput('Running...', 'idle');
    try {
      const response = await fetch(`${API_BASE}/api/execute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, language: 'python', stdin: '' }),
      });
      if (!response.ok) {
        const err = await response.json();
        setOutput(err.detail || 'Server error', 'error');
        return;
      }
      const result = await response.json();
      if (result.error) {
        setOutput(result.error, 'error');
      } else if (result.stderr) {
        setOutput(result.stderr, 'error');
      } else {
        setOutput(
          (result.stdout || '(No output)') + `\n\n⏱ ${result.execution_time_ms}ms`,
          'success'
        );
        if (result.frames && result.frames.length > 0) setFrames(result.frames);
      }
    } catch {
      setOutput(
        'Could not connect to backend.\nMake sure the server is running:\n  cd backend && python main.py',
        'error'
      );
    } finally {
      setIsRunning(false);
    }
  }, [code]);

  useEffect(() => {
    async function fetchStarterCode() {
      if (!currentAlgorithm) return;
      try {
        const res = await fetch(`${API_BASE}/api/algorithms/${currentAlgorithm}`);
        if (res.ok) {
          const data = await res.json();
          const header = `# Python Implementation with Visualization SDK
#
# Use these tools to animate the visualizer:
# dsa.track(arr) - Tell the visualizer what array to watch
# dsa.compare(i, j) - Highlight elements being compared
# dsa.swap(i, j) - Highlight elements being swapped
# dsa.complete() - Mark the array as sorted

`;
          setCode(header + data.sample_code_python);
        } else {
          setCode('# Could not load starter code from server');
        }
      } catch {
        setCode('# Backend server is not reachable');
      }
    }
    fetchStarterCode();
  }, [currentAlgorithm]);

  return (
    <div className="code-panel">
      <div className="code-panel-toolbar">
        <select className="lang-select" defaultValue="python" disabled>
          <option value="python">PYTHON</option>
        </select>
        <button
          className="btn btn-primary btn-sm"
          onClick={handleRun}
          disabled={isRunning}
        >
          {isRunning ? '⏳ RUNNING' : '▶ RUN CODE'}
        </button>
      </div>

      <div className="code-panel-editor">
        <Editor
          height="100%"
          defaultLanguage="python"
          theme="vs-dark"
          value={code}
          onChange={(v) => setCode(v || '')}
          options={{
            fontSize: 13,
            fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            padding: { top: 12 },
            lineNumbers: 'on',
            glyphMargin: false,
            renderLineHighlight: 'line',
            bracketPairColorization: { enabled: true },
            automaticLayout: true,
            wordWrap: 'on',
          }}
        />
      </div>

      <div className={`code-panel-output ${outputType}`}>
        <div className="code-panel-output-header">▸ OUTPUT</div>
        <div className="code-panel-output-body">
          {output || 'Press ▶ RUN CODE to execute. Output appears here.'}
        </div>
      </div>
    </div>
  );
}
