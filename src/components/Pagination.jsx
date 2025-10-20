import React from "react";
import "./Pagination.css";

export default function Pagination({ page, pageCount, onPage }) {
  if (!pageCount || pageCount <= 1) return null;
  const arr = [];
  for (let i = 1; i <= pageCount; i++) arr.push(i);
  return (
    <div className="pg-wrap" role="navigation" aria-label="pagination">
      {arr.map((p) => (
        <button key={p} className={`pg-btn ${p === page ? "active" : ""}`} onClick={() => onPage(p)}>{p}</button>
      ))}
    </div>
  );
}
