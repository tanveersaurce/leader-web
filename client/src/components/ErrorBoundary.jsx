import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-cream px-4 text-center">
          <h1 className="text-4xl md:text-5xl text-charcoal font-bold font-serif mb-4">
            कुछ गड़बड़ हो गई है
          </h1>
          <p className="text-lg text-gray-700 font-sans max-w-md mb-8">
            An unexpected error occurred. Please refresh or try again.
          </p>
          <button
            onClick={this.handleRetry}
            className="px-8 py-3 bg-saffron hover:bg-saffron-dark text-white font-medium rounded shadow-lg transition-colors font-sans focus-visible:outline focus-visible:outline-3 focus-visible:outline-saffron focus-visible:outline-offset-2"
          >
            फिर से प्रयास करें / Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
