import React from 'react'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-brand-50 p-4">
          <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-xl text-center">
            <h1 className="text-3xl font-serif font-bold text-brand-950 mb-4">Something went wrong</h1>
            <p className="text-brand-600 mb-8">We encountered an unexpected error. Please try refreshing the page or contact support if the issue persists.</p>
            <button 
              onClick={() => window.location.reload()}
              className="bg-brand-950 text-white px-8 py-3 text-sm font-bold tracking-widest uppercase hover:bg-brand-800 transition-colors"
            >
              Refresh Page
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
