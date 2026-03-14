import { Dataset, TableSchema } from '../schema/schemaTypes';
import { detectChartFields } from './chartDetector';
import { aggregateData, aggregateDataByCount, AggregatedDataPoint } from './aggregationEngine';
import { toTitleCase } from '../utils/stringUtils';

export type ChartType = 'bar' | 'pie' | 'line'; // Keeping it simple for generation

export interface InsightWidget {
  id: string;
  title: string;
  type: ChartType;
  data: AggregatedDataPoint[];
  xAxisKey: string;
  yAxisKeys: string[]; // Can support stacked/multi bar if multiple metrics
}

/**
 * Generates an array of insightful charts based on the dataset and its schema.
 */
export const generateInsights = (dataset: Dataset, schema: TableSchema): InsightWidget[] => {
  if (!dataset || dataset.length === 0 || !schema) return [];

  const { dimensions, metrics } = detectChartFields(schema);
  const widgets: InsightWidget[] = [];

  // Generate at most 4 high-quality charts
  const maxCharts = 4;

  // 1. Dimensions + Metrics (The most powerful insights)
  if (dimensions.length > 0 && metrics.length > 0) {
    for (const dim of dimensions) {
      if (widgets.length >= maxCharts) break;
      
      const dimInfo = schema[dim];
      const targetMetrics = metrics.slice(0, 2); // Show top 1-2 metrics
      
      const aggregated = aggregateData(dataset, dim, targetMetrics);
      
      // Sort: Dates ASC, others Descending by primary metric
      if (dimInfo.type === 'date') {
        aggregated.sort((a, b) => new Date(a[dim]).getTime() - new Date(b[dim]).getTime());
      } else {
        const primaryMetric = targetMetrics[0];
        aggregated.sort((a, b) => (b[primaryMetric] || 0) - (a[primaryMetric] || 0));
      }

      const isLine = dimInfo.type === 'date';
      const isPie = !isLine && aggregated.length > 0 && aggregated.length <= 5 && targetMetrics.length === 1;

      widgets.push({
        id: `chart-${dim}-metrics`,
        title: `${targetMetrics.map(toTitleCase).join(' & ')} by ${toTitleCase(dim)}`,
        type: isPie ? 'pie' : isLine ? 'line' : 'bar',
        data: aggregated,
        xAxisKey: dim,
        yAxisKeys: targetMetrics
      });
    }
  }

  // 2. Counts (Distributions) - Only if we have space left
  if (dimensions.length > 0 && widgets.length < maxCharts) {
    for (const dim of dimensions) {
      if (widgets.length >= maxCharts) break;
      if (widgets.some(w => w.id.includes(dim))) continue; // Avoid duplicate dimensions

      const dimInfo = schema[dim];
      const aggregated = aggregateDataByCount(dataset, dim);
      
      if (dimInfo.type === 'date') {
        aggregated.sort((a, b) => new Date(a[dim]).getTime() - new Date(b[dim]).getTime());
      } else {
        aggregated.sort((a, b) => b.count - a.count);
      }

      const isLine = dimInfo.type === 'date';

      widgets.push({
        id: `chart-${dim}-count`,
        title: `Distribution of ${toTitleCase(dim)}`,
        type: isLine ? 'line' : (aggregated.length <= 6 ? 'pie' : 'bar'),
        data: aggregated,
        xAxisKey: dim,
        yAxisKeys: ['count']
      });
    }
  }

  return widgets;
};
