import React from 'react';

export const NumberRenderer: React.FC<{ value: any }> = ({ value }) => {
  if (value === null || value === undefined) return null;
  
  // Try to parse and format nicely (e.g., 10000 -> 10,000)
  const num = Number(value);
  if (!isNaN(num)) {
    return <span className="rst-cell-number">{new Intl.NumberFormat().format(num)}</span>;
  }
  
  return <span className="rst-cell-number">{String(value)}</span>;
};
