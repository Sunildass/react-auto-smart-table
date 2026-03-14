import { Dataset } from '../schema/schemaTypes';

export interface AggregatedDataPoint {
  [key: string]: any; // Dimension name -> value, Metric name -> value
}

/**
 * Groups dataset by a specific dimension and sums the metrics
 */
export const aggregateData = (
  dataset: Dataset,
  dimension: string,
  metrics: string[]
): AggregatedDataPoint[] => {
  if (!dataset || dataset.length === 0) return [];
  if (!dimension) return [];

  const groups = new Map<any, AggregatedDataPoint>();

  for (const row of dataset) {
    let dimValue = row[dimension];
    
    // Normalize dimension values for grouping
    if (dimValue === null || dimValue === undefined) {
      dimValue = 'Unknown';
    } else if (typeof dimValue === 'boolean') {
      dimValue = dimValue ? 'Yes' : 'No';
    }

    if (!groups.has(dimValue)) {
      const initPoint: AggregatedDataPoint = { [dimension]: dimValue };
      for (const m of metrics) {
        initPoint[m] = 0;
      }
      groups.set(dimValue, initPoint);
    }

    const group = groups.get(dimValue)!;

    for (const m of metrics) {
      const val = row[m];
      let numVal = 0;
      if (typeof val === 'number') {
        numVal = val;
      } else if (typeof val === 'string') {
        numVal = Number(val.replace(/[^0-9.-]/g, ''));
      }
      
      if (!isNaN(numVal)) {
        group[m] += numVal;
      }
    }
  }

  return Array.from(groups.values());
};

/**
 * Groups dataset by a dimension and simply counts occurrences 
 * (useful when there are no metrics)
 */
export const aggregateDataByCount = (
  dataset: Dataset,
  dimension: string
): AggregatedDataPoint[] => {
  if (!dataset || dataset.length === 0) return [];

  const groups = new Map<any, number>();

  for (const row of dataset) {
    let dimValue = row[dimension];
    if (dimValue === null || dimValue === undefined) {
      dimValue = 'Unknown';
    } else if (typeof dimValue === 'boolean') {
      dimValue = dimValue ? 'Yes' : 'No';
    }

    groups.set(dimValue, (groups.get(dimValue) || 0) + 1);
  }

  return Array.from(groups.entries()).map(([dim, count]) => ({
    [dimension]: dim,
    count: count
  }));
};
