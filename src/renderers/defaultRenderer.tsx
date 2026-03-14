import React from 'react';

export const DefaultRenderer: React.FC<{ value: any }> = ({ value }) => {
  if (value === null || value === undefined) return null;
  
  // Render objects as stringified JSON if needed (though schema shouldn't emit complex objects as strings natively unless unstructured)
  if (typeof value === 'object') {
    return <span className="rst-cell-default">{JSON.stringify(value)}</span>;
  }
  
  return <span className="rst-cell-default">{String(value)}</span>;
};
