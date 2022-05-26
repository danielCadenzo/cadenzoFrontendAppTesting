import React, { useMemo, memo } from 'react';
import PropTypes from 'prop-types';
import { DateTime } from 'luxon';
import styled from 'styled-components';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 8px 0;
  border-bottom: 1px solid #c4c4c4;
  color: #495057;
  font-weight: normal;
`;

const SlotDetails = ({ slot }) => {
  alert(JSON.stringify(slot))
  const startDate = useMemo(
    () =>
      DateTime.fromSQL(slot.startTime, {
        zone: 'utc',
      }).toLocal(),
    [slot.startDate],
  );

  const endDate = useMemo(
    () =>
      DateTime.fromSQL(slot.endTime, {
        zone: 'utc',
      }).toLocal(),
    [slot.endDate],
  );

  return (
    <Wrapper className="d-flex flex-column full-width">
      <div className="d-flex flex-column f4">
        <p>Opener</p>
        {slot.guarantee > 0 ? <p> Min gurantee: {slot.guarantee}</p> : ''}
        {slot.revenueSplitAmount > 0 ? (
          <p> Min Door Split: {slot.revenueSplitAmount}</p>
        ) : (
          ''
        )}
      </div>
      <p className="d-flex flex-shrink-0 flex-justify-center f5">
        {startDate.toFormat('t')}
        {' - '}
        {endDate.toFormat('t')}
      </p>
    </Wrapper>
  );
};

SlotDetails.propTypes = {
  slot: PropTypes.object.isRequired,
  isSelected: PropTypes.bool,
};

export default memo(SlotDetails);
