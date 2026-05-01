import React from "react";

interface AsyncErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error; retry: () => void }>;
}

interface AsyncErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class AsyncErrorBoundary extends React.Component<
  AsyncErrorBoundaryProps,
  AsyncErrorBoundaryState
> {
  public static getDerivedStateFromError(error: Error): AsyncErrorBoundaryState {
    return { hasError: true, error };
  }

  constructor(props: AsyncErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  public componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log async errors (like those from promises not caught elsewhere)
    console.error("Async error boundary caught error:", error, errorInfo);
  }

  public retry = () => {
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError) {
      const FallbackComponent = this.props.fallback;
      if (FallbackComponent) {
        return React.createElement(FallbackComponent, {
          error: this.state.error!,
          retry: this.retry,
        });
      }
      return (
        <div style={{ textAlign: "center", padding: "2rem" }}>
          <h3>Something went wrong</h3>
          <p>{this.state.error?.message}</p>
          <button onClick={this.retry} style={{ marginTop: "1rem" }}>
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}