'use client';

import React, { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

class SafeAdWrapper extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Silently log error - don't break the dashboard
    if (process.env.NODE_ENV === 'development') {
      console.error('Ad component error (silently handled):', error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      // Fail silently - return nothing
      return null;
    }

    return this.props.children;
  }
}

export default SafeAdWrapper;

