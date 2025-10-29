import React from "react";

type ErrorBoundaryState = {
  hasError: boolean;
  error?: Error;
};

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
  console.error(error, errorInfo);
}

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col justify-center items-center min-h-screen p-4 bg-red-50 text-red-700">
          <h1 className="text-3xl font-bold mb-2">Something went wrong.</h1>
          <p className="mb-4">Please refresh the page or try again later.</p>
          <button
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            onClick={() => this.setState({ hasError: false, error: undefined })}
          >
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
