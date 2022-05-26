import React, { Component } from 'react';

import CreatableSelect from 'react-select/creatable';

export default class CreatableSingle extends Component {
  render() {
    const { className, onChange, options, ...rest } = this.props;
    return (
      <CreatableSelect
        isClearable
        className={className}
        onChange={onChange}
        options={options}
        {...rest}
      />
    );
  }
}