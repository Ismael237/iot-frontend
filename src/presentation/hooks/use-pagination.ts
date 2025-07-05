import { useState, useMemo } from 'react';

interface UsePaginationOptions {
  totalItems: number;
  initialPage?: number;
  initialPageSize?: number;
  pageSizeOptions?: number[];
}

export const usePagination = ({
  totalItems,
  initialPage = 1,
  initialPageSize = 20,
  pageSizeOptions = [10, 20, 50, 100]
}: UsePaginationOptions) => {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);

  const totalPages = useMemo(() => Math.ceil(totalItems / pageSize), [totalItems, pageSize]);
  const startIndex = useMemo(() => (currentPage - 1) * pageSize, [currentPage, pageSize]);
  const endIndex = useMemo(() => Math.min(startIndex + pageSize, totalItems), [startIndex, pageSize, totalItems]);

  const goToPage = (page: number) => {
    const validPage = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(validPage);
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToFirstPage = () => {
    setCurrentPage(1);
  };

  const goToLastPage = () => {
    setCurrentPage(totalPages);
  };

  const changePageSize = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1); // Reset to first page when changing page size
  };

  const paginationInfo = useMemo(() => ({
    currentPage,
    pageSize,
    totalItems,
    totalPages,
    startIndex,
    endIndex,
    hasNextPage: currentPage < totalPages,
    hasPreviousPage: currentPage > 1,
    pageSizeOptions
  }), [currentPage, pageSize, totalItems, totalPages, startIndex, endIndex, pageSizeOptions]);

  return {
    ...paginationInfo,
    goToPage,
    goToNextPage,
    goToPreviousPage,
    goToFirstPage,
    goToLastPage,
    changePageSize
  };
}; 