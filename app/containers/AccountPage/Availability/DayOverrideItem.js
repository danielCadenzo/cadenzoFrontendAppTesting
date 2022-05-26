import React from 'react';
import PropTypes from 'prop-types';
import { DateTime } from 'luxon';
import trashIcon from 'images/icons/trash.svg';
import { getDateTimeFromOverride } from './utils';

function DayOverrideItem({ startTime, override, index, onDelete }) {
  const timeRange = startTime.isLuxonDateTime
    ? override
    : getDateTimeFromOverride(override);

  if (override.isDisabled) {
    return (
      <div className="d-flex flex-justify-between roboto p-2">
        <p className="roboto">
          {timeRange.startTime.toLocaleString({
            month: 'short',
            day: 'numeric',
          })}
        </p>

        <p>Disabled</p>

        <button type="button" onClick={() => onDelete([index])}>
          <img alt="delete" src={trashIcon} width={20} height={20} />
        </button>
      </div>
    );
  }
  return (
    <div className="d-flex flex-justify-between roboto p-2">
      <p className="roboto">
        {timeRange.startTime.toLocaleString({ month: 'short', day: 'numeric' })}
      </p>
      <div className="d-flex text-center flex-items-center">
        <p className="roboto">
          {timeRange.startTime.toLocaleString(DateTime.TIME_SIMPLE)}
        </p>
        {' - '}
        <p className="roboto">
          {timeRange.endTime.toLocaleString(DateTime.TIME_SIMPLE)}
        </p>
      </div>

      <button type="button" onClick={() => onDelete([index])}>
        <img alt="delete" src={trashIcon} width={20} height={20} />
      </button>
    </div>
  );
}

DayOverrideItem.propTypes = {
  startTime: PropTypes.object.isRequired,
  onDelete: PropTypes.func,
  index: PropTypes.number,
  override: PropTypes.object,
};

export default DayOverrideItem;
