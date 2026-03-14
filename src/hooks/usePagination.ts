import { useState, useMemo } from 'react';
import { Dataset } from '../schema/schemaTypes';

export interface UsePaginationResult {
  paginatedData: Dataset;
  currentPage: number;
  pageSize: number;
  totalPages: number;
  setPage: (page: number) => void;
  setPageSize: (size: number) => void;
}

export const usePagination = (
  data: Dataset,
  initialPageSize: number = 10
): UsePaginationResult => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);

  const totalPages = Math.max(1, Math.ceil(data.length / pageSize));

  // Ensure current page is valid when data shrinks (e.g., from filtering)
  const safeCurrentPage = Math.min(currentPage, totalPages);

  const paginatedData = useMemo(() => {
    const startIndex = (safeCurrentPage - 1) * pageSize;
    return data.slice(startIndex, startIndex + pageSize);
  }, [data, safeCurrentPage, pageSize]);

  return {
    paginatedData,
    currentPage: safeCurrentPage,
    pageSize,
    totalPages,
    setPage: setCurrentPage,
    setPageSize
  };
};
