import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPreviousPage: () => void;
  onNextPage: () => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage, totalPages, onPreviousPage, onNextPage,
}) => (
  <div>
    <button type="button" onClick={onPreviousPage} disabled={currentPage === 1}>
      Previous Page
    </button>
    <button type="button" onClick={onNextPage} disabled={currentPage === totalPages}>
      Next Page
    </button>
    <p>
      Page
      {' '}
      {currentPage}
      {' '}
      of
      {' '}
      {totalPages}
    </p>
  </div>
);

export default Pagination;
