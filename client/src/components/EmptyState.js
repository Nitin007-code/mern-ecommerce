import React from "react";
import { Link } from "react-router-dom";

function EmptyState({
  title,
  message,
  buttonText,
  buttonLink = "/",
  icon = "🛍️",
}) {
  return (
    <div className="empty-state">

      <div className="empty-icon">
        {icon}
      </div>

      <h2>{title}</h2>

      <p>{message}</p>

      <Link
        to={buttonLink}
        className="empty-btn"
      >
        {buttonText}
      </Link>

    </div>
  );
}

export default EmptyState;