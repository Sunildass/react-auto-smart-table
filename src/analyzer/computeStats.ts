import { Dataset, ColumnType } from '../schema/schemaTypes';

export interface ColumnStats {
  uniqueValues?: number;
  min?: number;
  max?: number;
}

export const computeColumnStats = (columnKey: string, dataset: Dataset, type: ColumnType): ColumnStats => {
  const stats: ColumnStats = {};
  
  const uniqueVals = new Set<any>();
  let min: number | undefined = undefined;
  let max: number | undefined = undefined;

  for (const row of dataset) {
    const val = row[columnKey];
    if (val !== null && val !== undefined && val !== '') {
      uniqueVals.add(val);

      if (type === 'number' || type === 'currency' || type === 'percentage') {
        let numVal = NaN;
        if (type === 'number') numVal = Number(val);
        else if (type === 'currency' || type === 'percentage') {
          const clean = String(val).replace(/[^0-9.-]/g, '');
          numVal = Number(clean);
        }

        if (!isNaN(numVal)) {
          if (min === undefined || numVal < min) min = numVal;
          if (max === undefined || numVal > max) max = numVal;
        }
      } else if (type === 'date') {
        const d = new Date(val).getTime();
        if (!isNaN(d)) {
          if (min === undefined || d < min) min = d;
          if (max === undefined || d > max) max = d;
        }
      }
    }
  }

  stats.uniqueValues = uniqueVals.size;
  if (min !== undefined) stats.min = min;
  if (max !== undefined) stats.max = max;

  return stats;
};
