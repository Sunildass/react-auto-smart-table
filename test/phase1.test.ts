import { describe, it, expect } from 'vitest';
import { detectValueType } from '../src/analyzer/detectTypes';
import { sampleDataset } from '../src/analyzer/sampleDataset';
import { computeColumnStats } from '../src/analyzer/computeStats';
import { buildSchema } from '../src/schema/buildSchema';
import { Dataset } from '../src/schema/schemaTypes';

describe('Phase 1: Schema Inference Engine', () => {
  describe('detectValueType', () => {
    it('detects emails', () => {
      expect(detectValueType('test@example.com')).toBe('email');
    });

    it('detects urls', () => {
      expect(detectValueType('https://google.com')).toBe('url');
      expect(detectValueType('www.example.org/path')).toBe('url');
    });

    it('detects images', () => {
      expect(detectValueType('https://example.com/image.png')).toBe('image');
      expect(detectValueType('picture.jpeg')).toBe('image');
    });

    it('detects dates', () => {
      expect(detectValueType('2023-01-01')).toBe('date');
      expect(detectValueType(new Date())).toBe('date');
    });

    it('detects currencies', () => {
      expect(detectValueType('$100.50')).toBe('currency');
      expect(detectValueType('£20')).toBe('currency');
    });

    it('detects percentages', () => {
      expect(detectValueType('99.9%')).toBe('percentage');
      expect(detectValueType('-5%')).toBe('percentage');
    });

    it('detects numbers', () => {
      expect(detectValueType(42)).toBe('number');
      expect(detectValueType('3.1415')).toBe('number');
    });

    it('detects booleans', () => {
      expect(detectValueType(true)).toBe('boolean');
      expect(detectValueType('false')).toBe('boolean');
      expect(detectValueType('yes')).toBe('boolean');
    });

    it('defaults to string', () => {
      expect(detectValueType('hello world')).toBe('string');
      expect(detectValueType(null)).toBe('string');
      expect(detectValueType('')).toBe('string');
    });
  });

  describe('sampleDataset', () => {
    it('samples up to maxSampleSize', () => {
      const data: Dataset = Array.from({ length: 500 }, (_, i) => ({ id: i }));
      const sampled = sampleDataset(data, 200);
      expect(sampled.length).toBe(200);
      
      const smallData: Dataset = Array.from({ length: 50 }, (_, i) => ({ id: i }));
      const smallSampled = sampleDataset(smallData, 200);
      expect(smallSampled.length).toBe(50);
    });
  });

  describe('computeColumnStats', () => {
    it('computes stats for numbers', () => {
      const data: Dataset = [{ val: 10 }, { val: 20 }, { val: 5 }, { val: 10 }];
      const stats = computeColumnStats('val', data, 'number');
      expect(stats.min).toBe(5);
      expect(stats.max).toBe(20);
      expect(stats.uniqueValues).toBe(3);
    });
  });

  describe('buildSchema', () => {
    it('infers schema including fallback to string, with confidence > 0.7', () => {
      const data: Dataset = [
        { age: 25, name: 'Alice', active: true, balance: '$100', joined: '2023-01-01' },
        { age: 30, name: 'Bob', active: false, balance: '$250', joined: '2023-02-01' },
        { age: 35, name: 'Charlie', active: true, balance: '$50', joined: '2023-03-01' },
        // 1 outlier won't ruin confidence (3/4 = 0.75 > 0.7)
        { age: 'unknown', name: 'Dave', active: 'yes', balance: 'none', joined: 'unknown_date' },
      ];

      const schema = buildSchema(data);

      expect(schema.age.type).toBe('number');
      expect(schema.age.min).toBe(25);
      expect(schema.age.max).toBe(35);
      
      expect(schema.name.type).toBe('string');
      expect(schema.name.uniqueValues).toBe(4);

      expect(schema.active.type).toBe('boolean');
      expect(schema.balance.type).toBe('currency');
      expect(schema.joined.type).toBe('date');
    });

    it('falls back to string if confidence <= 0.7', () => {
      const data: Dataset = [
        { mix: 25 },
        { mix: 'hello' },
        { mix: true },
        { mix: 'world' },
      ];
      const schema = buildSchema(data);
      expect(schema.mix.type).toBe('string');
    });
  });
});
