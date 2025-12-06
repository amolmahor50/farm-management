import React from "react";

export function Skeleton({ className = "", style = {}, ...props }) {
  return (
    <div
      className={`animate-pulse bg-gray-200 dark:bg-gray-700 rounded ${className}`}
      style={{ height: "1.5em", ...style }}
      {...props}
    />
  );
}
