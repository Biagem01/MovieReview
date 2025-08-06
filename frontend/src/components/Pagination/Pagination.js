import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  };

  const handlePageChangeLocal = (page) => {
    if (page < 1 || page > totalPages) return;
    onPageChange(page);
  };

  return (
    <div className="pagination">
      <button
        onClick={() => handlePageChangeLocal(currentPage - 1)}
        disabled={currentPage === 1}
        className="page-btn"
      >
        &laquo; Prev
      </button>

      {getPageNumbers().map((page) => (
        <button
          key={page}
          onClick={() => handlePageChangeLocal(page)}
          className={`page-btn ${currentPage === page ? 'active' : ''}`}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => handlePageChangeLocal(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="page-btn"
      >
        Next &raquo;
      </button>
    </div>
  );
};

export default Pagination;
