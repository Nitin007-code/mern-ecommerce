import React from "react";

function SkeletonLoader({ count = 8 }) {
  return (
    <div className="product-grid">
      {[...Array(count)].map((_, index) => (
        <div key={index} className="skeleton-card">
          <div className="skeleton-image"></div>

          <div className="skeleton-content">
            <div className="skeleton-line skeleton-title"></div>
            <div className="skeleton-line"></div>
            <div className="skeleton-line skeleton-small"></div>

            <div className="skeleton-price"></div>

            <div className="skeleton-button"></div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default SkeletonLoader;