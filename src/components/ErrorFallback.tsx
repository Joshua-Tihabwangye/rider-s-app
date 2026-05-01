import React from "react";

export const ErrorFallback: React.FC<{ error: Error; resetError: () => void }> = ({ error, resetError }) => {
  return (
    <div style={{ textAlign: "center", padding: "2rem" }}>
      <h2>Something went wrong</h2>
      <p>We're sorry, but an unexpected error occurred.</p>
      <p>{error.message}</p>
      <button onClick={resetError} style={{ marginTop: "1rem" }}>
        Try Again
      </button>
    </div>
  );
};