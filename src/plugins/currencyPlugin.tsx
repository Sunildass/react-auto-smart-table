import React from 'react';
import { SmartTablePlugin } from '../schema/schemaTypes';

export const currencyPlugin: SmartTablePlugin = {
  detect: (columnKey: string, sample: any[]) => {
    const lowerKey = columnKey.toLowerCase();
    if (lowerKey.includes('amount') || lowerKey.includes('price') || lowerKey.includes('revenue')) {
      return 'currency';
    }
    return null;
  },
  
  render: ({ value }: { value: any }) => {
    if (value === null || value === undefined) return null;
    
    let num = NaN;
    if (typeof value === 'number') num = value;
    else if (typeof value === 'string') num = Number(value.replace(/[^0-9.-]/g, ''));
    
    if (isNaN(num)) return <span>{String(value)}</span>;

    const formatted = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(num);

    return (
      <span style={{ color: num < 0 ? '#d32f2f' : '#388e3c', fontWeight: 'bold' }}>
        {formatted}
      </span>
    );
  }
};
