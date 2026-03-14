import React from 'react';

interface JsonEditorProps {
  value: string;
  onChange: (value: string) => void;
  onReset: () => void;
}

export const JsonEditor: React.FC<JsonEditorProps> = ({ value, onChange, onReset }) => {
  const handleFormat = () => {
    try {
      const parsed = JSON.parse(value);
      onChange(JSON.stringify(parsed, null, 2));
    } catch (e) {
      // Ignore invalid JSON during format
    }
  };

  return (
    <div className="json-editor-container">
      <div className="json-editor-header">
        <h3>JSON DATASET</h3>
        <div className="editor-actions">
          <button className="btn btn-outline" onClick={handleFormat}>Format</button>
          <button className="btn btn-outline" onClick={onReset}>Reset</button>
        </div>
      </div>
      <textarea
        className="json-textarea"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        spellCheck={false}
        placeholder="Paste JSON array of objects here..."
      />
    </div>
  );
};
