import { useState, useMemo } from 'react';
import { Dataset, TableSchema } from '../schema/schemaTypes';

export type FilterStateValue = string | { min?: number; max?: number } | { start?: string; end?: string } | boolean | null;

export interface FilterState {
  [key: string]: FilterStateValue;
}

export interface UseFiltersResult {
  filteredData: Dataset;
  filters: FilterState;
  setFilter: (columnKey: string, value: FilterStateValue) => void;
  clearFilters: () => void;
}

export const useFilters = (data: Dataset, schema: TableSchema): UseFiltersResult => {
  const [filters, setFilters] = useState<FilterState>({});

  const setFilter = (columnKey: string, value: FilterStateValue) => {
    setFilters(prev => {
      const next = { ...prev };
      if (value === null || value === undefined || value === '') {
        delete next[columnKey];
      } else {
        next[columnKey] = value;
      }
      return next;
    });
  };

  const clearFilters = () => setFilters({});

  const filteredData = useMemo(() => {
    if (!filters || Object.keys(filters).length === 0 || !data || data.length === 0) {
      return data;
    }

    return data.filter(row => {
      for (const [key, filterValue] of Object.entries(filters)) {
        const rowValue = row[key];
        const type = schema[key]?.type || 'string';

        if (rowValue === null || rowValue === undefined) {
          // If filtering is active but the value is absent, we usually reject
          if (filterValue !== null && filterValue !== '') return false;
          continue;
        }

        switch (type) {
          case 'string':
          case 'email':
          case 'url':
            if (typeof filterValue === 'string') {
              if (!String(rowValue).toLowerCase().includes(filterValue.toLowerCase())) return false;
            }
            break;
            
          case 'number':
          case 'currency':
          case 'percentage':
            if (typeof filterValue === 'object' && filterValue !== null) {
              const numVal = typeof rowValue === 'number' ? rowValue : Number(String(rowValue).replace(/[^0-9.-]/g, ''));
              if (isNaN(numVal)) return false;
              
              const { min, max } = filterValue as { min?: number; max?: number };
              if (min !== undefined && numVal < min) return false;
              if (max !== undefined && numVal > max) return false;
            }
            break;
            
          case 'date':
            if (typeof filterValue === 'object' && filterValue !== null) {
              const dateVal = new Date(rowValue).getTime();
              if (isNaN(dateVal)) return false;

              const { start, end } = filterValue as { start?: string; end?: string };
              if (start && dateVal < new Date(start).getTime()) return false;
              if (end && dateVal > new Date(end).getTime()) return false;
            }
            break;

          case 'boolean':
            if (typeof filterValue === 'boolean') {
              const boolVal = rowValue === true || String(rowValue).toLowerCase() === 'true' || String(rowValue).toLowerCase() === 'yes';
              if (boolVal !== filterValue) return false;
            }
            break;
        }
      }
      return true;
    });
  }, [data, schema, filters]);

  return { filteredData, filters, setFilter, clearFilters };
};
