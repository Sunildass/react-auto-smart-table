export type Dataset = Record<string, any>[];

export type ColumnType =
  | 'string'
  | 'number'
  | 'boolean'
  | 'date'
  | 'email'
  | 'url'
  | 'currency'
  | 'percentage'
  | 'image';

export interface ColumnSchema {
  key: string;
  type: ColumnType;
  nullable: boolean;
  uniqueValues?: number;
  min?: number;
  max?: number;
}

export type TableSchema = Record<string, ColumnSchema>;

// Temporary placeholder for when Insight Engine is built
export interface InsightWidget {
  title: string;
  type: string;
  data: any[];
}

import type { ReactNode } from 'react';

export interface SmartTablePlugin {
  detect?: (columnKey: string, sample: any[]) => ColumnType | null;
  render?: (value: any) => ReactNode;
  insights?: (dataset: Dataset) => InsightWidget[];
}
