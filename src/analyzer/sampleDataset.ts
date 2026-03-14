import { Dataset } from '../schema/schemaTypes';

/**
 * Samples up to maxSampleSize rows from the dataset without scanning the whole array
 * sampleSize = min(200, dataset.length)
 */
export function sampleDataset(dataset: Dataset, maxSampleSize: number = 200): Dataset {
  if (!dataset || !dataset.length) return [];
  if (dataset.length <= maxSampleSize) return [...dataset];

  const sample: Dataset = [];
  const indices = new Set<number>();
  
  while (sample.length < maxSampleSize) {
    const idx = Math.floor(Math.random() * dataset.length);
    if (!indices.has(idx)) {
      indices.add(idx);
      sample.push(dataset[idx]);
    }
  }
  
  return sample;
}
