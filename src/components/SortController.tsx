import React from 'react';
import { SortDirection } from '../hooks/useSorting';

export interface SortControllerProps {
  columnKey: string;
  currentSortColumn: string | null;
  currentSortDirection: SortDirection;
  onSort: (columnKey: string) => void;
}

export const SortController: React.FC<SortControllerProps> = ({
  columnKey,
  currentSortColumn,
  currentSortDirection,
  onSort
}) => {
  const isActive = currentSortColumn === columnKey;

  return (
    <span 
      className={`rst-sort-controller ${isActive ? 'rst-sort-active' : ''}`}
      onClick={(e) => {
        e.stopPropagation();
        onSort(columnKey);
      }}
      style={{
        display: 'inline-flex',
        flexDirection: 'column',
        marginLeft: '4px',
        cursor: 'pointer',
        fontSize: '0.65em',
        verticalAlign: 'middle',
        userSelect: 'none'
      }}
    >
      <span style={{ color: isActive && currentSortDirection === 'asc' ? '#000' : '#ccc', lineHeight: '0.8' }}>▲</span>
      <span style={{ color: isActive && currentSortDirection === 'desc' ? '#000' : '#ccc', lineHeight: '0.8' }}>▼</span>
    </span>
  );
};
