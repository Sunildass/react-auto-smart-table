import './styles.css';
export * from './schema/schemaTypes';
export { detectValueType } from './analyzer/detectTypes';
export { sampleDataset } from './analyzer/sampleDataset';
export { computeColumnStats } from './analyzer/computeStats';
export { buildSchema } from './schema/buildSchema';

export * from './hooks/useSorting';
export * from './hooks/useFilters';
export * from './hooks/usePagination';

export * from './insights/aggregationEngine';
export * from './insights/chartDetector';
export { generateInsights } from './insights/insightBuilder';
export type { ChartType } from './insights/insightBuilder';

export * from './components/SmartTable';
export * from './components/FilterPanel';
export * from './components/InsightsPanel';
export * from './renderers/cellRendererFactory';
export * from './plugins/pluginRegistry';
export { currencyPlugin } from './plugins/currencyPlugin';
export { percentagePlugin } from './plugins/percentagePlugin';
