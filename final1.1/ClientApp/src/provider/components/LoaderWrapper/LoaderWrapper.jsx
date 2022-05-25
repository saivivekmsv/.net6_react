import React from "react";
import { Spinner } from "react-bootstrap";

export const Loader = ({ loaderText, size }) => {
  return (
    <div className="spinner-row d-flex align-items-center">
      <Spinner animation="border" size={size} role="status">
        <span className="sr-only">Loading...</span>
      </Spinner>
      &nbsp;&nbsp;{loaderText}
    </div>
  );
};

Loader.defaultProps = {
  loaderText: "Loading",
};

const LoaderWrapper = ({ children, isLoading, className = "", loaderText }) => {
  return (
    <div className={`loader-wrapper ${className}`}>
      {isLoading && (
        <div className="loader-wrapper-overlay">
          <Loader loaderText={loaderText} />
        </div>
      )}
      {children}
    </div>
  );
};

export default LoaderWrapper;
