import React from 'react';
import { TableSchema } from '../schema/schemaTypes';
import { SortDirection } from '../hooks/useSorting';
import { toTitleCase } from '../utils/stringUtils';

export interface TableHeaderProps {
  schema: TableSchema;
  sortable?: boolean;
  sortColumn?: string | null;
  sortDirection?: SortDirection;
  onSort?: (columnKey: string) => void;
}

export const getColumnWidthClass = (key: string, type: string): string => {
  const lowerKey = key.toLowerCase();
  if (lowerKey === 'id' || lowerKey === '_id' || type === 'boolean') return 'rst-col-xs';
  if (type === 'date' || type === 'number' || lowerKey.includes('status')) return 'rst-col-sm';
  if (lowerKey.includes('role') || lowerKey.includes('country') || lowerKey.includes('category')) return 'rst-col-md';
  if (lowerKey.includes('name') || lowerKey.includes('email') || lowerKey.includes('url') || lowerKey.includes('description')) return 'rst-col-flex';
  return 'rst-col-md';
};

export const TableHeader: React.FC<TableHeaderProps> = ({ 
  schema, 
  sortable = false, 
  sortColumn = null, 
  sortDirection = 'asc', 
  onSort 
}) => {
  const columns = Object.keys(schema);

  return (
    <thead className="rst-header">
      <tr className="rst-header-row">
        {columns.map(colKey => {
          const colInfo = schema[colKey];
          const widthClass = getColumnWidthClass(colKey, colInfo.type);

          return (
            <th 
              key={colKey}
              className={`rst-th rst-th-col-${colKey} rst-th-type-${colInfo.type} ${widthClass} ${sortable && onSort ? 'rst-sortable' : ''} ${sortColumn === colKey ? 'rst-sort-active' : ''}`}
              onClick={() => {
                if (sortable && onSort) onSort(colKey);
              }}
            >
              <div className="rst-header-content">
                <span>{toTitleCase(colKey)}</span>
                {sortable && onSort && (
                  <span className="rst-sort-icon">
                    {sortColumn === colKey ? (sortDirection === 'asc' ? '↑' : '↓') : '⇅'}
                  </span>
                )}
              </div>
            </th>
          );
        })}
      </tr>
    </thead>
  );
};
