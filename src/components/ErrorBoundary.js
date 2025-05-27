import React from "react";
import { Alert, Button, Container } from "react-bootstrap";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error details for debugging
    console.error("ErrorBoundary caught an error:", error, errorInfo);

    this.setState({
      error: error,
      errorInfo: errorInfo,
    });

    // In production, you might want to send this to an error reporting service
    // like Sentry, LogRocket, or Bugsnag
    if (process.env.NODE_ENV === "production") {
      // Example: ErrorReportingService.logError(error, errorInfo);
    }
  }

  handleReload = () => {
    // Clear error state and reload the page
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  handleReset = () => {
    // Clear error state without reloading
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      // Fallback UI when there's an error
      return (
        <Container className="py-5">
          <Alert variant="danger">
            <Alert.Heading>🚨 Oops! Something went wrong</Alert.Heading>
            <p>
              We're sorry, but something unexpected happened. This error has
              been logged and we'll work to fix it as soon as possible.
            </p>

            {/* Show error details in development */}
            {process.env.NODE_ENV === "development" && this.state.error && (
              <details className="mt-3">
                <summary className="cursor-pointer">
                  <strong>Technical Details (Development Mode)</strong>
                </summary>
                <pre className="mt-2 p-3 bg-dark text-light rounded">
                  <small>
                    {this.state.error.toString()}
                    {this.state.errorInfo.componentStack}
                  </small>
                </pre>
              </details>
            )}

            <hr />
            <div className="d-flex gap-2">
              <Button variant="primary" onClick={this.handleReset}>
                Try Again
              </Button>
              <Button variant="outline-secondary" onClick={this.handleReload}>
                Reload Page
              </Button>
              <Button
                variant="outline-info"
                onClick={() => (window.location.href = "/")}
              >
                Go Home
              </Button>
            </div>
          </Alert>
        </Container>
      );
    }

    // If no error, render children normally
    return this.props.children;
  }
}

export default ErrorBoundary;
