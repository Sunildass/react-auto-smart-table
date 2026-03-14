import { useState, useEffect, useMemo } from 'react';
import { SmartTable, currencyPlugin, percentagePlugin } from '../src';
import { PlaygroundLayout } from './components/PlaygroundLayout';
import { JsonEditor } from './components/JsonEditor';
import { EXAMPLE_DATASETS } from './examples';

const defaultJSONString = JSON.stringify(EXAMPLE_DATASETS.users, null, 2);

export default function App() {
  const [jsonText, setJsonText] = useState(defaultJSONString);
  const [data, setData] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (!jsonText.trim()) {
        setData([]);
        setError(null);
        return;
      }
      try {
        const parsed = JSON.parse(jsonText);
        if (Array.isArray(parsed)) {
          if (parsed.length > 0 && (typeof parsed[0] !== 'object' || parsed[0] === null)) {
             setError("JSON must be an array of objects");
          } else {
             setData(parsed);
             setError(null);
          }
        } else {
          setError("JSON must be an array of objects");
        }
      } catch (e) {
        setError("Invalid JSON");
      }
    }, 300);
    return () => clearTimeout(handler);
  }, [jsonText]);

  const stats = useMemo(() => {
    if (data.length === 0) return null;
    const columns = Object.keys(data[0] || {});
    const types = columns.map(col => typeof data[0][col]);
    const uniqueTypes = [...new Set(types)];
    return {
      records: data.length,
      columns: columns.length,
      types: uniqueTypes.join(', ')
    };
  }, [data]);

  const loadDataset = (key: keyof typeof EXAMPLE_DATASETS) => {
    setJsonText(JSON.stringify(EXAMPLE_DATASETS[key], null, 2));
  };

  const rightPanelContent = (
    <div className="preview-container">
      <div className="preview-header">
        <div className="panel-title">SmartTable Preview</div>
        <h3>Product Showcase</h3>
        <p>Auto-generated insights, filters, and records from your JSON.</p>
      </div>

      {stats && (
        <div className="stats-container">
          <div className="stat-badge">Records: <span>{stats.records}</span></div>
          <div className="stat-badge">Columns: <span>{stats.columns}</span></div>
          <div className="stat-badge">Types: <span>{stats.types}</span></div>
        </div>
      )}

      {error && <div className="error-panel">{error}</div>}
      
      {!error && data.length > 0 && (
        <SmartTable
          data={data}
          sortable
          filterable
          insights
          pagination
          plugins={[currencyPlugin, percentagePlugin]}
        />
      )}

      {!error && data.length === 0 && (
        <div className="rst-empty">
          Paste a JSON array of objects to see the SmartTable in action.
        </div>
      )}

      <div className="dataset-selector">
        <div className="panel-title">Explore Examples</div>
        <div className="dataset-buttons">
          <button className="dataset-btn" onClick={() => loadDataset('users')}>Users Dataset</button>
          <button className="dataset-btn" onClick={() => loadDataset('orders')}>Orders Dataset</button>
          <button className="dataset-btn" onClick={() => loadDataset('analytics')}>Analytics Dataset</button>
        </div>
      </div>
    </div>
  );

  return (
    <PlaygroundLayout
      leftPanel={
        <JsonEditor
          value={jsonText}
          onChange={setJsonText}
          onReset={() => loadDataset('users')}
        />
      }
      rightPanel={rightPanelContent}
    />
  );
}
