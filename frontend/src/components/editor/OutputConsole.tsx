import { useVisualizerStore } from '../../store/useVisualizerStore';

export default function OutputConsole() {
  const { output, outputType } = useVisualizerStore();

  return (
    <div className="output-console">
      <div className="output-header">
        <h4>📋 Output</h4>
      </div>
      <div className={`output-body ${outputType}`}>
        {output || 'Click "Run" to execute your code...'}
      </div>
    </div>
  );
}
