import React from "react";
import "./Pagination.css";

const Pagination = ({ page, pageCount, onChange }) => {
  if (pageCount < 2) return null;

  // To avoid clutter, show up to 5 page buttons, with ellipsis if needed
  const pages = [];
  let start = Math.max(1, page - 2);
  let end = Math.min(pageCount, start + 4);
  if (end - start < 4) start = Math.max(1, end - 4);

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  return (
    <nav className="pagination-main">
      <button
        className="pagination-btn"
        disabled={page === 1}
        onClick={() => onChange(page - 1)}
      >
        &laquo;
      </button>
      {start > 1 && (
        <>
          <button className="pagination-btn" onClick={() => onChange(1)}>1</button>
          <span className="pagination-ellipsis">...</span>
        </>
      )}
      {pages.map(p => (
        <button
          key={p}
          className={`pagination-btn${page === p ? " active" : ""}`}
          onClick={() => onChange(p)}
        >
          {p}
        </button>
      ))}
      {end < pageCount && (
        <>
          <span className="pagination-ellipsis">...</span>
          <button className="pagination-btn" onClick={() => onChange(pageCount)}>{pageCount}</button>
        </>
      )}
      <button
        className="pagination-btn"
        disabled={page === pageCount}
        onClick={() => onChange(page + 1)}
      >
        &raquo;
      </button>
    </nav>
  );
};

export default Pagination;
