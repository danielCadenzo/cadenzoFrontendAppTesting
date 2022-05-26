import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { DateTime } from 'luxon';
import DayOverrideItem from './DayOverrideItem';

function OverrideListContainer({ overrides, onDeleteOverrides }) {
  const groupedOverrides = overrides.reduce((acc, override, currIndex) => {
    const keyProp = override.startTime.toLocaleString(DateTime.DATE_SHORT);
    if (!acc[keyProp]) {
      acc[keyProp] = [{ ...override, index: currIndex }];
    } else {
      acc[keyProp] = [...acc[keyProp], { ...override, index: currIndex }];
    }
    return acc;
  }, {});

  const RenderedContent = () => (
    <Fragment>
      {Object.keys(groupedOverrides).map(groupKey => {
        const overrideGroup = groupedOverrides[groupKey];
        return (
          <div className="d-flex flex-column">
            <h3 className="h3">
              {overrideGroup[0].startTime.toLocaleString(DateTime.DATE_MED)}
            </h3>
            {overrideGroup.map(override => {
              const { index, ...rest } = override;
              return (
                <DayOverrideItem
                  index={index}
                  override={rest}
                  startTime={rest.startTime}
                  onDelete={onDeleteOverrides}
                  endTime={rest.endTime}
                />
              );
            })}
          </div>
        );
      })}
    </Fragment>
  );
  return (
    <div className="d-flex flex-column">
      <RenderedContent />
    </div>
  );
}

OverrideListContainer.propTypes = {
  onDeleteOverrides: PropTypes.func.isRequired,
  overrides: PropTypes.array.isRequired,
};

export default OverrideListContainer;
