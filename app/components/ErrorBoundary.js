import React, { Component } from 'react';
import H2 from 'components/H2';
import WarningIcon from 'images/icons/warning.svg';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hasError: false,
      error: { message: '', stack: '' },
      info: { componentStack: '' },
    };
  }

  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch = (error, info) => {
    console.error(error);
    console.info(info.componentStack);
    this.setState({ error, info });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="d-flex flex-column flex-justify-center p-3 flex-items-center">
          <img src={WarningIcon} height={300} />
          <H2>Oh no! something went wrong, try refreshing the page.</H2>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
