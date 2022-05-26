'use es6';

import AsyncSelect from 'react-select/async';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { debounce } from 'lodash';

class WithCallbacks extends Component {
  constructor(props) {
    super(props);
    this.handleInputChange = debounce(this.handleInputChange.bind(this), 1000);
  }

  state = { inputValue: '' };

  handleInputChange = newValue => {
    const { onChange, clearAfterSelect } = this.props;
    const inputValue = newValue.replace(/\W/g, '');
    if (!clearAfterSelect) this.setState({ inputValue });
  };

  handleOnChange = option => {
    const { onChange } = this.props;
    onChange(option);
  };

  render() {
    const { loadOptions, className, style, ...rest } = this.props;
    return (
      <div className={className} style={style}>
        <AsyncSelect
          cacheOptions
          loadOptions={loadOptions}
          defaultOptions
          onChange={this.handleOnChange}
          value={this.state.inputValue}
          onInputChange={this.handleInputChange}
          {...rest}
        />
      </div>
    );
  }
}

WithCallbacks.propTypes = {
  className: PropTypes.string,
  loadOptions: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  clearAfterSelect: PropTypes.bool,
  style: PropTypes.object,
};

WithCallbacks.defaultProps = {
  clearAfterSelect: false,
};

export default WithCallbacks;
