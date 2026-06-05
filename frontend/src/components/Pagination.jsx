import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const pages = [];
  const showEllipsis = totalPages > 7;
  if (!showEllipsis) {
    for (let i = 0; i < totalPages; i++) pages.push(i);
  } else {
    pages.push(0);
    if (currentPage > 3) pages.push('...');
    for (let i = Math.max(1, currentPage - 1); i <= Math.min(totalPages - 2, currentPage + 1); i++) {
      pages.push(i);
    }
    if (currentPage < totalPages - 4) pages.push('...');
    pages.push(totalPages - 1);
  }

  return (
    <div className="flex items-center justify-center gap-1.5 mt-8">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 0}
        className="p-2 rounded-lg border border-borderGray disabled:opacity-40 disabled:cursor-not-allowed hover:bg-softGray transition-colors"
      >
        <ChevronLeft className="h-4 w-4 text-darkCharcoal" />
      </button>

      {pages.map((page, idx) =>
        page === '...' ? (
          <span key={`ellipsis-${idx}`} className="px-2 text-mutedGray text-sm">…</span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`h-9 w-9 rounded-lg text-sm font-medium transition-colors ${
              page === currentPage
                ? 'bg-zomato-500 text-white shadow-sm'
                : 'border border-borderGray hover:bg-softGray text-darkCharcoal'
            }`}
          >
            {page + 1}
          </button>
        )
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages - 1}
        className="p-2 rounded-lg border border-borderGray disabled:opacity-40 disabled:cursor-not-allowed hover:bg-softGray transition-colors"
      >
        <ChevronRight className="h-4 w-4 text-darkCharcoal" />
      </button>
    </div>
  );
};

export default Pagination;
