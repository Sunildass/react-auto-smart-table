import { describe, it, expect } from 'vitest';
import { detectChartFields } from '../src/insights/chartDetector';
import { aggregateData, aggregateDataByCount } from '../src/insights/aggregationEngine';
import { generateInsights } from '../src/insights/insightBuilder';
import { TableSchema, Dataset } from '../src/schema/schemaTypes';

describe('Phase 4: Insight Engine', () => {
  describe('chartDetector', () => {
    it('accurately identifies dimensions and metrics', () => {
      const schema: TableSchema = {
        name: { key: 'name', type: 'string', nullable: false, uniqueValues: 5 },
        status: { key: 'status', type: 'boolean', nullable: false },
        revenue: { key: 'revenue', type: 'currency', nullable: false },
        user_id: { key: 'user_id', type: 'string', nullable: false, uniqueValues: 5000 }, // High cardinality => discard
        age: { key: 'age', type: 'number', nullable: false }
      };

      const result = detectChartFields(schema);
      expect(result.dimensions).toContain('name');
      expect(result.dimensions).toContain('status');
      expect(result.dimensions).not.toContain('user_id'); // Discarded due to lack of distinct counting or high cardinality pseudo-flag logic

      expect(result.metrics).toContain('revenue');
      expect(result.metrics).toContain('age');
    });
  });

  describe('aggregationEngine', () => {
    it('aggregates data correctly by sum', () => {
      const dataset: Dataset = [
        { category: 'A', value: 10, cost: '$5.00' },
        { category: 'A', value: 20, cost: '$2.00' },
        { category: 'B', value: 30, cost: '$10.00' }
      ];

      const result = aggregateData(dataset, 'category', ['value', 'cost']);

      expect(result).toHaveLength(2);
      
      const groupA = result.find(d => d.category === 'A');
      expect(groupA).toBeDefined();
      expect(groupA?.value).toBe(30);
      expect(groupA?.cost).toBe(7); // 5 + 2 parsed correctly
      
      const groupB = result.find(d => d.category === 'B');
      expect(groupB?.value).toBe(30);
      expect(groupB?.cost).toBe(10);
    });

    it('aggregates data correctly by count', () => {
      const dataset: Dataset = [
        { category: 'A' },
        { category: 'A' },
        { category: 'A' },
        { category: 'B' }
      ];

      const result = aggregateDataByCount(dataset, 'category');
      
      expect(result).toHaveLength(2);
      
      const groupA = result.find(d => d.category === 'A');
      expect(groupA?.count).toBe(3);
      
      const groupB = result.find(d => d.category === 'B');
      expect(groupB?.count).toBe(1);
    });
  });

  describe('insightBuilder', () => {
    it('generates appropriate widgets for Dataset with Dimensions and Metrics', () => {
      const dataset: Dataset = [
        { country: 'US', sales: 1500 },
        { country: 'US', sales: 500 },
        { country: 'UK', sales: 800 }
      ];

      const schema: TableSchema = {
        country: { key: 'country', type: 'string', nullable: false, uniqueValues: 2 },
        sales: { key: 'sales', type: 'number', nullable: false }
      };

      const widgets = generateInsights(dataset, schema);
      
      // Should generate a chart per dimension
      expect(widgets).toHaveLength(1);
      
      const w = widgets[0];
      expect(w.id).toContain('chart-country-metrics');
      expect(w.type).toBe('pie'); // 2 unique values <= 5 and 1 metric => pie
      expect(w.xAxisKey).toBe('country');
      expect(w.yAxisKeys).toEqual(['sales']);
      
      const usData = w.data.find(d => d.country === 'US');
      expect(usData?.sales).toBe(2000);
    });
  });
});
