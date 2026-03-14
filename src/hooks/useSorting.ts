import { useState, useMemo } from 'react';
import { Dataset, TableSchema } from '../schema/schemaTypes';

export type SortDirection = 'asc' | 'desc';

export interface UseSortingResult {
  sortedData: Dataset;
  sortColumn: string | null;
  sortDirection: SortDirection;
  handleSort: (columnKey: string) => void;
}

export const useSorting = (
  data: Dataset,
  schema: TableSchema,
  initialSortColumn: string | null = null,
  initialSortDirection: SortDirection = 'asc'
): UseSortingResult => {
  const [sortColumn, setSortColumn] = useState<string | null>(initialSortColumn);
  const [sortDirection, setSortDirection] = useState<SortDirection>(initialSortDirection);

  const handleSort = (columnKey: string) => {
    if (sortColumn === columnKey) {
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else {
        // Toggle off sorting if clicking desc again (optional behavior, here we just toggle between asc/desc/off)
        setSortColumn(null);
        setSortDirection('asc');
      }
    } else {
      setSortColumn(columnKey);
      setSortDirection('asc');
    }
  };

  const sortedData = useMemo(() => {
    if (!sortColumn || !data || data.length === 0) return data;

    const columnType = schema[sortColumn]?.type || 'string';

    return [...data].sort((a, b) => {
      let valA = a[sortColumn];
      let valB = b[sortColumn];

      if (valA === valB) return 0;
      if (valA === null || valA === undefined) return sortDirection === 'asc' ? 1 : -1;
      if (valB === null || valB === undefined) return sortDirection === 'asc' ? -1 : 1;

      let comparison = 0;

      switch (columnType) {
        case 'number':
        case 'currency':
        case 'percentage':
          const numA = typeof valA === 'number' ? valA : Number(String(valA).replace(/[^0-9.-]/g, ''));
          const numB = typeof valB === 'number' ? valB : Number(String(valB).replace(/[^0-9.-]/g, ''));
          comparison = (isNaN(numA) ? 0 : numA) - (isNaN(numB) ? 0 : numB);
          break;
        case 'date':
          const dateA = new Date(valA).getTime();
          const dateB = new Date(valB).getTime();
          comparison = (isNaN(dateA) ? 0 : dateA) - (isNaN(dateB) ? 0 : dateB);
          break;
        case 'boolean':
          const boolA = valA === true || String(valA).toLowerCase() === 'true' || String(valA).toLowerCase() === 'yes' ? 1 : 0;
          const boolB = valB === true || String(valB).toLowerCase() === 'true' || String(valB).toLowerCase() === 'yes' ? 1 : 0;
          comparison = boolA - boolB;
          break;
        default:
          comparison = String(valA).localeCompare(String(valB));
          break;
      }

      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [data, schema, sortColumn, sortDirection]);

  return { sortedData, sortColumn, sortDirection, handleSort };
};
