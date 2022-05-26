import React from 'react';
import PropTypes from 'prop-types';
import omit from 'lodash/omit';

import { SingleDatePicker } from 'react-dates';

class SingleDatePickerWrapper extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      focused: props.autoFocus,
      date: props.initialDate,
    };

    this.onDateChange = this.onDateChange.bind(this);
    this.onFocusChange = this.onFocusChange.bind(this);
    this.onUpdate = this.onUpdate.bind(this);
  }

  componentDidMount() {
    const { initialDate = null } = this.props;
    if (initialDate) this.onUpdate(initialDate);
  }

  onDateChange(date) {
    this.setState({ date });
    this.onUpdate(date);
  }

  onFocusChange({ focused }) {
    this.setState({ focused });
  }

  onUpdate(value) {
    const { onUpdate } = this.props;
    if (onUpdate) onUpdate(value);
  }

  render() {
    const { focused, date } = this.state;

    // autoFocus and initialDate are helper props for the example wrapper but are not
    // props on the SingleDatePicker itself and thus, have to be omitted.
    const props = omit(this.props, ['autoFocus', 'initialDate']);

    return (
      <SingleDatePicker
        {...props}
        id="date_input"
        date={date}
        focused={focused}
        onDateChange={this.onDateChange}
        onFocusChange={this.onFocusChange}
      />
    );
  }
}

export default SingleDatePickerWrapper;
