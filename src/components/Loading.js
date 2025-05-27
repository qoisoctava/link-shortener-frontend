import React from "react";
import { Spinner, Container } from "react-bootstrap";

/**
 * Reusable Loading Component
 * @param {Object} props - Component props
 * @param {string} props.size - Size of spinner: 'sm' | 'md' | 'lg'
 * @param {string} props.variant - Bootstrap color variant
 * @param {string} props.message - Loading message to display
 * @param {boolean} props.fullPage - Whether to show full page loading
 * @param {boolean} props.overlay - Whether to show as overlay
 * @param {React.ReactNode} props.children - Custom loading content
 */
function Loading({
  size = "md",
  variant = "primary",
  message = "Loading...",
  fullPage = false,
  overlay = false,
  children,
}) {
  // Determine spinner size based on size prop
  const getSpinnerSize = () => {
    switch (size) {
      case "sm":
        return { width: "1.5rem", height: "1.5rem" };
      case "lg":
        return { width: "3rem", height: "3rem" };
      default:
        return { width: "2rem", height: "2rem" };
    }
  };

  const spinnerStyle = getSpinnerSize();

  // Custom loading content if provided
  if (children) {
    return fullPage ? (
      <Container className="d-flex justify-content-center align-items-center min-vh-100">
        {children}
      </Container>
    ) : (
      <div className="text-center py-3">{children}</div>
    );
  }

  // Default loading spinner
  const loadingContent = (
    <div className="text-center">
      <Spinner
        animation="border"
        variant={variant}
        style={spinnerStyle}
        role="status"
        className="mb-2"
      >
        <span className="visually-hidden">Loading...</span>
      </Spinner>
      {message && (
        <div className="text-muted">
          <small>{message}</small>
        </div>
      )}
    </div>
  );

  // Full page loading
  if (fullPage) {
    return (
      <Container className="d-flex justify-content-center align-items-center min-vh-100">
        {loadingContent}
      </Container>
    );
  }

  // Overlay loading
  if (overlay) {
    return (
      <div
        className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          zIndex: 9999,
        }}
      >
        <div className="bg-white p-4 rounded shadow">{loadingContent}</div>
      </div>
    );
  }

  // Default inline loading
  return <div className="py-3">{loadingContent}</div>;
}

// Predefined loading variants for common use cases
Loading.Button = ({ size = "sm", className = "" }) => (
  <Spinner
    animation="border"
    size={size}
    className={className}
    style={{ width: "1rem", height: "1rem" }}
  />
);

Loading.Card = ({ message = "Loading..." }) => (
  <div className="card">
    <div className="card-body text-center py-4">
      <Loading size="lg" message={message} />
    </div>
  </div>
);

Loading.Page = ({ message = "Loading application..." }) => (
  <Loading fullPage message={message} size="lg" />
);

export default Loading;
