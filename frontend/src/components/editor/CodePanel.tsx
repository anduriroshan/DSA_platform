import { useState, useCallback, useRef, useEffect } from 'react';
import Editor, { Monaco } from '@monaco-editor/react';
import { useVisualizerStore } from '../../store/useVisualizerStore';
import { algorithmRegistry } from '../../utils/algorithmRegistry';
import OutputConsole from './OutputConsole';

const API_BASE = 'http://localhost:8000';

export default function CodePanel() {
  const { currentAlgorithm, setOutput, setIsRunning, isRunning, setFrames, currentStep, frames } = useVisualizerStore();
  const config = algorithmRegistry[currentAlgorithm];

  const [code, setCode] = useState('Loading starter code...');
  const editorRef = useRef<any>(null);
  const monacoRef = useRef<Monaco | null>(null);
  const [decorations, setDecorations] = useState<string[]>([]);

  const handleEditorMount = (editor: any, monaco: Monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;
  };

  // Highlight current line from frames
  useEffect(() => {
    if (!editorRef.current || !monacoRef.current || frames.length === 0) return;
    const currentFrame = frames[currentStep];
    if (currentFrame && 'codeLineHighlight' in currentFrame) {
      const line = currentFrame.codeLineHighlight;
      if (line > 0) {
        const newDecorations = editorRef.current.deltaDecorations(decorations, [
          {
            range: new monacoRef.current.Range(line, 1, line, 1),
            options: {
              isWholeLine: true,
              className: 'monaco-line-highlight',
              glyphMarginClassName: 'monaco-glyph-arrow',
            },
          },
        ]);
        setDecorations(newDecorations);
      }
    }
  }, [currentStep, frames]);

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
          result.stdout || '(No output)' + `\n\n⏱ ${result.execution_time_ms}ms`,
          'success'
        );
        if (result.frames && result.frames.length > 0) {
          setFrames(result.frames);
        }
      }
    } catch (err) {
      setOutput(
        'Could not connect to backend.\nMake sure the server is running:\n  cd backend && python main.py',
        'error'
      );
    } finally {
      setIsRunning(false);
    }
  }, [code]);

  // Fetch starter code from backend when algorithm changes
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
#
# The tracer will automatically highlight the executing line!

`;
          setCode(header + data.sample_code_python);
        } else {
          setCode('# Could not load starter code from server');
        }
      } catch (e) {
        setCode('# Backend server is not reachable');
      }
    }
    
    fetchStarterCode();
  }, [currentAlgorithm]);

  return (
    <>
      <div className="panel-header">
        <h3>💻 Code Editor</h3>
        <div className="code-actions">
          <span className="select" style={{ padding: '4px 8px', fontSize: '0.72rem' }}>Python</span>
          <button
            className="btn btn-primary btn-sm"
            onClick={handleRun}
            disabled={isRunning}
          >
            {isRunning ? '⏳ Running...' : '▶ Run'}
          </button>
        </div>
      </div>
      <div className="editor-container">
        <Editor
          height="100%"
          defaultLanguage="python"
          theme="vs-dark"
          value={code}
          onMount={handleEditorMount}
          onChange={(value) => setCode(value || '')}
          options={{
            fontSize: 13,
            fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            padding: { top: 12 },
            lineNumbers: 'on',
            glyphMargin: true,
            renderLineHighlight: 'line',
            bracketPairColorization: { enabled: true },
            automaticLayout: true,
            wordWrap: 'on',
          }}
        />
      </div>
      <OutputConsole />
    </>
  );
}
