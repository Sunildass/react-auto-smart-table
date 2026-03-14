import React from 'react';
import { TableSchema } from '../schema/schemaTypes';
import { FilterState, FilterStateValue } from '../hooks/useFilters';

import { toTitleCase } from '../utils/stringUtils';

export interface FilterPanelProps {
  schema: TableSchema;
  filters: FilterState;
  onFilterChange: (columnKey: string, value: FilterStateValue) => void;
  onClear: () => void;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({ schema, filters, onFilterChange, onClear }) => {
  const handleStringChange = (key: string, e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange(key, e.target.value || null);
  };

  const handleNumberChange = (key: string, field: 'min' | 'max', value: string) => {
    const current = (filters[key] as { min?: number; max?: number }) || {};
    const num = parseFloat(value);
    
    const next = { ...current };
    if (isNaN(num)) {
      delete next[field];
    } else {
      next[field] = num;
    }

    if (Object.keys(next).length === 0) {
      onFilterChange(key, null);
    } else {
      onFilterChange(key, next);
    }
  };

  const handleDateChange = (key: string, field: 'start' | 'end', value: string) => {
    const current = (filters[key] as { start?: string; end?: string }) || {};
    const next = { ...current };
    
    if (!value) {
      delete next[field];
    } else {
      next[field] = value;
    }

    if (Object.keys(next).length === 0) {
      onFilterChange(key, null);
    } else {
      onFilterChange(key, next);
    }
  };

  const handleBooleanToggle = (key: string) => {
    const current = filters[key];
    if (current === true) {
      onFilterChange(key, false);
    } else if (current === false) {
      onFilterChange(key, null); // Tri-state: true -> false -> null(all)
    } else {
      onFilterChange(key, true);
    }
  };

  return (
    <div className="rst-filter-panel">
      {Object.entries(schema).map(([key, colInfo]) => {
        const type = colInfo.type;
        const currentFilter = filters[key];

        return (
          <div key={key} className={`rst-filter-group rst-filter-type-${type}`}>
            <label>
              {toTitleCase(key)} Filter
            </label>

            {(type === 'string' || type === 'email' || type === 'url') && (
              <input 
                type="text" 
                placeholder={`Search ${toTitleCase(key)}...`} 
                value={(currentFilter as string) || ''}
                onChange={(e) => handleStringChange(key, e)}
              />
            )}

            {(type === 'number' || type === 'currency' || type === 'percentage') && (
              <div className="rst-filter-range">
                <input 
                  type="number" 
                  placeholder="Min" 
                  value={(currentFilter as any)?.min ?? ''}
                  onChange={(e) => handleNumberChange(key, 'min', e.target.value)}
                />
                <input 
                  type="number" 
                  placeholder="Max" 
                  value={(currentFilter as any)?.max ?? ''}
                  onChange={(e) => handleNumberChange(key, 'max', e.target.value)}
                />
              </div>
            )}

            {type === 'date' && (
              <div className="rst-filter-range">
                <input 
                  type="date" 
                  title="Start Date"
                  value={(currentFilter as any)?.start || ''}
                  onChange={(e) => handleDateChange(key, 'start', e.target.value)}
                />
                <input 
                  type="date" 
                  title="End Date"
                  value={(currentFilter as any)?.end || ''}
                  onChange={(e) => handleDateChange(key, 'end', e.target.value)}
                />
              </div>
            )}

            {type === 'boolean' && (
              <button 
                className="rst-filter-toggle"
                onClick={() => handleBooleanToggle(key)}
                style={{ 
                  backgroundColor: currentFilter === true ? '#e6f4ea' : currentFilter === false ? '#fce8e6' : '#fff',
                }}
              >
                {currentFilter === true ? 'Only Yes' : currentFilter === false ? 'Only No' : 'All'}
              </button>
            )}
          </div>
        );
      })}
      
      {Object.keys(filters).length > 0 && (
        <button 
          className="rst-filter-clear-btn"
          onClick={onClear}
        >
          Clear All Filters
        </button>
      )}
    </div>
  );
};
