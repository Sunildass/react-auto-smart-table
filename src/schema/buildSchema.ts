import { Dataset, TableSchema, ColumnSchema, ColumnType } from './schemaTypes';
import { sampleDataset } from '../analyzer/sampleDataset';
import { detectValueType } from '../analyzer/detectTypes';
import { computeColumnStats } from '../analyzer/computeStats';
import { PluginRegistry } from '../plugins/pluginRegistry';

export const buildSchema = (dataset: Dataset, registry?: PluginRegistry): TableSchema => {
  if (!dataset || dataset.length === 0) return {};

  const sample = sampleDataset(dataset, 200);
  const sampleSize = sample.length;
  
  // Get all keys
  const keys = new Set<string>();
  for (const row of sample) {
    for (const key of Object.keys(row)) {
      keys.add(key);
    }
  }

  const schema: TableSchema = {};

  for (const key of keys) {
    const values = sample.map(row => row[key]);
    
    // 1. Ask plugins if they want to override the detection explicitly
    let detectedTypeStr = null;
    
    if (registry) {
      detectedTypeStr = registry.runDetectors(key, values);
    }

    if (detectedTypeStr) {
      const isNull = values.some(v => v === null || v === undefined);
      schema[key] = {
        key,
        type: detectedTypeStr as any,
        nullable: isNull
      };
      
      const stats = computeColumnStats(key, sample, detectedTypeStr as any);
      schema[key].uniqueValues = stats.uniqueValues;
      if (stats.min !== undefined) schema[key].min = stats.min;
      if (stats.max !== undefined) schema[key].max = stats.max;
      
      continue; 
    }

    // 2. Standard detection logic fallback
    let nullCount = 0;
    const typeCounts: Record<string, number> = {};

    for (const row of sample) {
      const val = row[key];
      if (val === null || val === undefined || val === '') {
        nullCount++;
      } else {
        const detectedType = detectValueType(val);
        typeCounts[detectedType] = (typeCounts[detectedType] || 0) + 1;
      }
    }

    const validValuesCount = sampleSize - nullCount;
    let dominantType: ColumnType = 'string';

    if (validValuesCount > 0) {
      let maxCount = 0;
      let topType = 'string';

      for (const [type, count] of Object.entries(typeCounts)) {
        if (count > maxCount) {
          maxCount = count;
          topType = type;
        }
      }

      // accept if confidence > 0.7 otherwise fallback to string
      const confidence = maxCount / validValuesCount;
      dominantType = confidence > 0.7 ? (topType as ColumnType) : 'string';
    }

    const stats = computeColumnStats(key, sample, dominantType);

    const columnSchema: ColumnSchema = {
      key,
      type: dominantType,
      nullable: nullCount > 0,
      uniqueValues: stats.uniqueValues,
    };

    if (stats.min !== undefined) columnSchema.min = stats.min;
    if (stats.max !== undefined) columnSchema.max = stats.max;

    schema[key] = columnSchema;
  }

  return schema;
};
