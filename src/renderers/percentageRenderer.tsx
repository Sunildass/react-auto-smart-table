import React from 'react';

export const PercentageRenderer: React.FC<{ value: any }> = ({ value }) => {
  if (value === null || value === undefined) return null;
  
  const str = String(value);
  // If it already contains %, just return it
  if (str.includes('%')) {
    return <span className="rst-cell-percentage">{str}</span>;
  }
  
  // If it's a raw number float, multiply and add % - not strictly required here based on our detector logic,
  // but good for safety matching if someone passes a float instead of stringified percent.
  const num = Number(value);
  if (!isNaN(num)) {
    return <span className="rst-cell-percentage">{(num * 100).toFixed(2)}%</span>;
  }

  return <span className="rst-cell-percentage">{str}</span>;
};
