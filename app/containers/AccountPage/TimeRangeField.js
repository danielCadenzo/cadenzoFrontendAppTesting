import React, { Fragment } from 'react';
import DateTimeField from 'components/Form/DateTimeField';
import AddIcon from '@material-ui/icons/Add';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import { IconButton } from '@material-ui/core';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const TimeFieldWrapper = styled.div`
  width: 100px;
`;

const StyledTimeField = styled(DateTimeField)`
  display: block;
  box-sizing: border-box;
  width: 100%;
  min-height: 46px;
  padding: 10px 14px;
  color: rgb(26, 26, 26);
  font-size: 16px;
  line-height: 1.5;
  word-wrap: normal;
  background: #ffffff;
  border: 1px solid #d0d0d0;
  border-radius: 8px;
  -webkit-appearance: none;
  appearance: none;
`;

const DateSelect = ({ startTime, endTime, onDelete, onAdd, id }) => {
  const clsName = day === 'SUNDAY' ? '' : 'border-top';
  const checkboxName = `${day}-isEnabled`;
  const checkboxVal = !!formValues[checkboxName];
  const defaultValue = day !== 'SUNDAY';
  return (
    <Fragment>
      <div className={`d-flex flex-items-center py-2 ${clsName}`}>
        <Fragment>
          <TimeFieldWrapper>
            <StyledTimeField
              showTimeSelect
              className="full-width roboto"
              name={`${id}.startTime`}
              showTimeSelectOnly
              timeIntervals={15}
              defaultValue={startTime}
              timeCaption="Time"
              dateFormat="h:mm aa"
            />
          </TimeFieldWrapper>
          <p className="mx-1">-</p>
          <TimeFieldWrapper>
            <StyledTimeField
              className="full-width roboto"
              showTimeSelect
              name={`${id}.endTime`}
              showTimeSelectOnly
              timeIntervals={15}
              timeCaption="Time"
              dateFormat="h:mm aa"
              defaultValue={endTime}
            />
          </TimeFieldWrapper>
          <IconButton onClick={onDelete} className="mx-2">
            <DeleteOutlineIcon />
          </IconButton>
          <IconButton onClick={onAdd}>
            <AddIcon />{' '}
          </IconButton>
        </Fragment>
      </div>
    </Fragment>
  );
};

DateSelect.propTypes = {
  day: PropTypes.object.isRequired,
  formValues: PropTypes.object.isRequired,
  onDelete: PropTypes.func.isRequired,
  onAdd: PropTypes.func,
  startTime: PropTypes.object,
  endTime: PropTypes.object,
};

export default DateSelect;
