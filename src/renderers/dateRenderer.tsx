import React from 'react';

export const DateRenderer: React.FC<{ value: any }> = ({ value }) => {
  if (!value) return null;
  
  const d = new Date(value);
  if (isNaN(d.getTime())) {
    return <span className="rst-cell-date">{String(value)}</span>;
  }
  
  // Format based on local standard
  return (
    <span className="rst-cell-date" title={d.toISOString()}>
      {d.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })}
    </span>
  );
};
