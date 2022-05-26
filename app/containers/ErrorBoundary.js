import React, { Component } from 'react';
import H2 from 'components/H2';
import { withRouter } from 'react-router';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hasError: false,
    };

    const { history } = this.props;

    history.listen((location, action) => {
      if (this.state.hasError) {
        this.setState({
          hasError: false,
        });
      }
    });
  }

  static getDerivedStateFromError(error) {
    return {
      hasError: false,
    };
  }

  render() {
    if (this.state.hasError) {
      // console.log(this.state.hasError);
      return (
        <H2 style={{ display: 'flex', justifyContent: 'center' }}>
          Error has occured
        </H2>
      );
    // console.log(this.state.hasError);
    return this.props.children;
    
  }
}

export default withRouter(ErrorBoundary);
