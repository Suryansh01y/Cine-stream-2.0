import React from "react";

function EmptyState({ message }) {
  return (
    <div className="empty-state">
      <div className="empty-icon">🎬</div>
      <h2>No data found</h2>
      <p>{message}</p>
    </div>
  );
}

export default EmptyState;
