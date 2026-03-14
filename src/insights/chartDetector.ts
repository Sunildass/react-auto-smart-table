import { TableSchema, ColumnType, Dataset } from '../schema/schemaTypes';

export type FieldRole = 'dimension' | 'metric' | 'discard';

export interface ChartDetectionResult {
  dimensions: string[];
  metrics: string[];
}

/**
 * Analyzes the schema to categorize fields into dimensions (x-axis/groups) and metrics (y-axis/values)
 */
export const detectChartFields = (schema: TableSchema): ChartDetectionResult => {
  const dimensions: string[] = [];
  const metrics: string[] = [];

  for (const [key, col] of Object.entries(schema)) {
    // Ignore ID fields - they make meaningless charts
    const lowerKey = key.toLowerCase();
    const isIdField = 
      lowerKey === 'id' || 
      lowerKey === '_id' || 
      lowerKey === 'uuid' || 
      lowerKey === 'guid' || 
      lowerKey.endsWith('id') || 
      lowerKey.endsWith('_id') ||
      lowerKey.endsWith('uuid');

    if (isIdField) {
      continue;
    }

    const role = determineFieldRole(col.type, col.uniqueValues);
    if (role === 'dimension') {
      dimensions.push(key);
    } else if (role === 'metric') {
      metrics.push(key);
    }
  }

  return { dimensions, metrics };
};

const determineFieldRole = (type: ColumnType, uniqueValues?: number): FieldRole => {
  switch (type) {
    case 'boolean':
      return 'dimension';
    case 'string':
      // Strings with low-to-medium cardinality are good for dimensions (countries, roles, etc.)
      if (uniqueValues !== undefined && uniqueValues > 1 && uniqueValues <= 20) {
        return 'dimension';
      }
      return 'discard';
    case 'date':
      return 'dimension';
    case 'number':
    case 'currency':
    case 'percentage':
      return 'metric';
    default:
      return 'discard';
  }
};
