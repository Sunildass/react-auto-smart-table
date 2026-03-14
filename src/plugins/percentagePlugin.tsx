import React from 'react';
import { SmartTablePlugin } from '../schema/schemaTypes';

export const percentagePlugin: SmartTablePlugin = {
  detect: (columnKey: string, sample: any[]) => {
    const lowerKey = columnKey.toLowerCase();
    if (lowerKey.includes('percent') || lowerKey.includes('rate')) {
      return 'percentage';
    }
    return null;
  },
  
  render: ({ value }: { value: any }) => {
    if (value === null || value === undefined) return null;
    
    let str = String(value);
    let num = Number(value);
    
    if (!str.includes('%') && !isNaN(num)) {
      return (
        <span style={{ 
          backgroundColor: '#e3f2fd', 
          padding: '2px 6px', 
          borderRadius: '4px',
          color: '#1565c0',
          fontSize: '0.9em',
          fontWeight: 600
        }}>
          {(num * 100).toFixed(1)}%
        </span>
      );
    }

    return (
      <span style={{ 
        backgroundColor: '#e3f2fd', 
        padding: '2px 6px', 
        borderRadius: '4px',
        color: '#1565c0',
        fontSize: '0.9em',
        fontWeight: 600
      }}>
        {str}
      </span>
    );
  }
};
