import 'react-dates/initialize';
import './datepicker.scss';
import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { DayPickerSingleDateController } from 'react-dates';
import omit from 'lodash/omit';
import BookingCalendarDayDisplay from './BookingCalendarDayDisplay';

class DayPickerSingleDateControllerWrapper extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      focused: true,
      date: props.initialDate,
      multiSelectDates: props.multiSelectDates,
    };

    this.onDateChange = this.onDateChange.bind(this);
    this.onFocusChange = this.onFocusChange.bind(this);
    this.onUpdate = this.onUpdate.bind(this);
    this.handleIsDayHighlighted = this.handleIsDayHighlighted.bind(this);
  }

  onDateChange(date) {
    this.setState({ date });
    this.onUpdate(date);
  }

  onUpdate(value, isMultiValue) {
    const { onUpdate, isMulti } = this.props;
    if (isMulti && isMultiValue && onUpdate) onUpdate(value);
    if (onUpdate && (!isMulti && !isMultiValue))
      onUpdate(value, this.state.multiSelectDates);
  }

  renderCalendarDate = (day, mods) => {
    const { isMulti } = this.props;
    if (!day) return null;
    const modifiers = new Set(mods);
    const { multiSelectDates } = this.state;
    if (modifiers && multiSelectDates.some(d => d.isSame(day))) {
      modifiers.add('selected');
    }
    if (modifiers && !multiSelectDates.some(d => d.isSame(day)))
      modifiers.delete('selected');
    return (
      <BookingCalendarDayDisplay
        dayInfo={day}
        modifiers={modifiers}
        onDayClick={() => {
          let newSelection;
          if (isMulti) {
            const wasPreviouslyPicked = multiSelectDates.some(d =>
              d.isSame(day),
            );
            if (wasPreviouslyPicked)
              newSelection = multiSelectDates.filter(d => !d.isSame(day));
            else {
              newSelection = [...multiSelectDates, day];
            }
            this.setState({
              multiSelectDates: newSelection,
            });
            this.onUpdate(newSelection, true);
          } else {
            this.onDateChange(newSelection);
          }
        }}
      />
    );
  };

  onFocusChange() {
    // Force the focused states to always be truthy so that date is always selectable
    this.setState({ focused: true });
  }

  handleIsDayHighlighted(day) {
    const { isDayHighlighted } = this.props;
    if (isDayHighlighted) return isDayHighlighted(day);
    return this.state.multiSelectDates.some(d => d.isSame(day, 'day'));
  }

  render() {
    const { showInput } = this.props;
    const { focused, date } = this.state;

    const props = omit(this.props, ['autoFocus', 'initialDate']);

    const dateString = date && date.format('YYYY-MM-DD');

    return (
      <Fragment>
        {showInput && (
          <div style={{ marginBottom: 16 }}>
            <input
              type="text"
              name="start date"
              value={dateString || ''}
              readOnly
            />
          </div>
        )}

        <DayPickerSingleDateController
          onDateChange={this.onDateChange}
          onFocusChange={this.onFocusChange}
          isDayHighlighted={this.handleIsDayHighlighted}
          renderDayContents={this.renderCalendarDate}
          focused={focused}
          date={date}
          {...props}
        />
      </Fragment>
    );
  }
}

DayPickerSingleDateControllerWrapper.propTypes = {
  isDayHighlighted: PropTypes.func,
  multiSelectDates: PropTypes.array,
};

DayPickerSingleDateControllerWrapper.defaultProps = {
  multiSelectDates: [],
};

export default DayPickerSingleDateControllerWrapper;
