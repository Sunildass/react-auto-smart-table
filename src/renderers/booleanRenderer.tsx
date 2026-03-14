import React from 'react';

export const BooleanRenderer: React.FC<{ value: any }> = ({ value }) => {
  if (value === null || value === undefined) return null;

  let isTrue = false;
  if (typeof value === 'boolean') {
    isTrue = value;
  } else if (typeof value === 'string') {
    const lower = value.toLowerCase();
    isTrue = lower === 'true' || lower === 'yes';
  } else if (typeof value === 'number') {
    isTrue = value > 0;
  }

  return (
    <span 
      className={`rst-cell-boolean rst-cell-boolean-${isTrue ? 'true' : 'false'}`}
      style={{
        display: 'inline-block',
        padding: '2px 8px',
        borderRadius: '12px',
        fontSize: '0.85em',
        fontWeight: 'bold',
        backgroundColor: isTrue ? '#e6f4ea' : '#fce8e6',
        color: isTrue ? '#137333' : '#c5221f'
      }}
    >
      {isTrue ? 'Yes' : 'No'}
    </span>
  );
};
