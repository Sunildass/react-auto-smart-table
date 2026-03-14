import React, { useMemo } from 'react';
import { Dataset } from '../schema/schemaTypes';
import { buildSchema } from '../schema/buildSchema';
import { TableHeader } from './TableHeader';
import { TableBody } from './TableBody';
import { FilterPanel } from './FilterPanel';
import { InsightsPanel } from './InsightsPanel';
import { useSorting } from '../hooks/useSorting';
import { useFilters } from '../hooks/useFilters';
import { usePagination } from '../hooks/usePagination';
import { SmartTablePlugin } from '../schema/schemaTypes';
import { PluginRegistry } from '../plugins/pluginRegistry';

export interface SmartTableProps {
  data: Dataset;
  sortable?: boolean;
  filterable?: boolean;
  pagination?: boolean;
  insights?: boolean;
  plugins?: SmartTablePlugin[];
}

export const SmartTable: React.FC<SmartTableProps> = ({ 
  data,
  sortable = false,
  filterable = false,
  pagination = false,
  insights = false,
  plugins = []
}) => {
  // Setup plugins
  const registry = useMemo(() => {
    const reg = new PluginRegistry();
    if (plugins && plugins.length > 0) {
      reg.register(plugins);
    }
    return reg;
  }, [plugins]);

  // Memoize schema so it's only rebuilt when data changes structurally
  const schema = useMemo(() => {
    return buildSchema(data, registry);
  }, [data, registry]);

  // Hooks (conditionally applying logic internally, but we always call them per React rules)
  // Flow: Raw Data -> Filtered Data -> Sorted Data -> Paginated Data
  
  const { filteredData, filters, setFilter, clearFilters } = useFilters(data, schema);
  const dataToFilter = filterable ? filteredData : data;

  const { sortedData, sortColumn, sortDirection, handleSort } = useSorting(dataToFilter, schema);
  const dataToRenderOrPaginate = sortable ? sortedData : dataToFilter;

  const { paginatedData, currentPage, totalPages, setPage } = usePagination(dataToRenderOrPaginate, 10);
  const finalData = pagination ? paginatedData : dataToRenderOrPaginate;

  const [showFilters, setShowFilters] = React.useState(true);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  if (!data || data.length === 0) {
    return (
      <div className="rst-container">
        <div className="rst-empty">No data to display.</div>
      </div>
    );
  }

  const summaryStats = (
    <div className="rst-summary-strip">
      <span>{data.length} Records</span>
      <span className="rst-dot">•</span>
      <span>{Object.keys(schema).length} Columns</span>
      <span className="rst-dot">•</span>
      <span>Types: {Array.from(new Set(Object.values(schema).map(c => c.type))).join(', ')}</span>
    </div>
  );

  return (
    <div className="rst-container">
      <header className="rst-main-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <h2>Smart Table</h2>
            <p>Auto-generated insights, filters, and records</p>
          </div>
          {filterable && (
            <button 
              className="rst-toggle-filters-btn"
              onClick={() => setShowFilters(!showFilters)}
            >
              Filters {showFilters ? '▲' : '▼'}
            </button>
          )}
        </div>
      </header>
      
      {insights && (
        <InsightsPanel data={dataToRenderOrPaginate} schema={schema} />
      )}

      {summaryStats}

      {filterable && showFilters && (
        <section className="rst-card">
          <FilterPanel 
            schema={schema} 
            filters={filters} 
            onFilterChange={setFilter} 
            onClear={clearFilters} 
          />
        </section>
      )}

      {data.length > 0 && finalData.length === 0 && (
        <div className="rst-empty-results-card">
          <div className="rst-empty-icon">🔍</div>
          <h3>No results found</h3>
          <p>Try adjusting your filters to find what you're looking for.</p>
          <button className="btn btn-primary" onClick={clearFilters}>Clear All Filters</button>
        </div>
      )}

      {data.length > 0 && finalData.length > 0 && (
        <section className="rst-card">
          <div className="rst-table-container" ref={scrollRef}>
            <table className="rst-table">
              <TableHeader 
                schema={schema} 
                sortable={sortable}
                sortColumn={sortColumn}
                sortDirection={sortDirection}
                onSort={handleSort}
              />
              <TableBody 
                data={finalData} 
                schema={schema} 
                registry={registry} 
                scrollRef={scrollRef}
              />
            </table>
          </div>

          {pagination && (
            <div className="rst-pagination">
              <button 
                disabled={currentPage === 1}
                onClick={() => setPage(currentPage - 1)}
              >
                Previous
              </button>
              <span>Page {currentPage} of {totalPages}</span>
              <button 
                disabled={currentPage === totalPages}
                onClick={() => setPage(currentPage + 1)}
              >
                Next
              </button>
            </div>
          )}
        </section>
      )}
    </div>
  );
};
