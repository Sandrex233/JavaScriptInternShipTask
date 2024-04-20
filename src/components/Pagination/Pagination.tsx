import React from 'react';
import './pagination.css';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPreviousPage: () => void;
  onNextPage: () => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage, totalPages, onPreviousPage, onNextPage,
}) => (
  <div className="pagination-container">
    <button
      type="button"
      className="pagination-button"
      onClick={onPreviousPage}
      disabled={currentPage === 1}
    >
      {'<'}
    </button>
    <p className="pagination-text">
      Page
      {' '}
      {currentPage}
      {' '}
      of
      {' '}
      {totalPages}
    </p>
    <button
      type="button"
      className="pagination-button"
      onClick={onNextPage}
      disabled={currentPage === totalPages}
    >
      {'>'}
    </button>
  </div>
);

export default Pagination;
