import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Input from 'components/Input/Loadable';
import Button from 'components/Button/index';
import searchIcon from 'images/icons/search.svg';
import { toMonthDayString, sameDay } from 'utils/dates';
import Calendar from 'components/Calendar';

const SearchContainer = styled.span`
  border-radius: 4px;
  -webkit-box-flex: 1 !important;
  -webkit-box-align: center !important;
  align-items: center !important;
  border: 1px solid rgb(221, 221, 221) !important;
  border-radius: 32px !important;
  display: flex !important;
  flex-grow: 1 !important;
  background-color: rgb(247, 247, 247) !important;
  box-shadow: none !important;

  @media (max-width: 450px) {
    flex-direction: column;
    margin: 8px 16px;
  }
`;

const SearchInput = styled(Input)`
  display: block !important;
  border: 0px !important;
  margin: 0px !important;
  padding: 0px !important;
  width: 100% !important;
  background: none !important;
  font-size: 14px !important;
  line-height: 18px !important;
  font-weight: 600 !important;
  color: #222222 !important;
  text-overflow: ellipsis !important;
  min-height: 18px;
  outline: none !important;
`;

const DatePickerInput = styled(Calendar)`
  display: block !important;
  border: 0px !important;
  margin: 0px !important;
  padding: 0px !important;
  width: 100% !important;
  background: none !important;
  font-size: 14px !important;
  line-height: 18px !important;
  font-weight: 600 !important;
  color: #222222 !important;
  text-overflow: ellipsis !important;
  min-height: 18px;
  outline: none !important;
  font-family: 'Work Sans', Helvetica;

  & * {
    width: 100%;
  }
`;

const SearchWrapper = styled.div`
  cursor: pointer !important;
  display: block !important;
  background-clip: padding-box !important;
  border: 1px solid transparent !important;
  border-radius: 32px !important;
  -webkit-flex: 1 0 0% !important;
  -ms-flex: 1 0 0% !important;
  flex: 1 0 0% !important;
  min-width: 0px !important;
  padding: 14px 32px !important;
  flex: 1 0 0% !important;
  width: 100%;
    

  &:before {
    border-width: 0 1px !important;
    border-style: solid !important;
    border-color: var(--big-search-form-background, transparent) !important;
    content: "" !important;
    display: none !important;
    height: 32px !important;
    margin-top: -16px !important;
    position: absolute !important;
    right: 0px !important;
    top: 50% !important;
    z-index: 0 !important;
    border-left: 0px !important;
  }

  &:focus {
    outline: none;
  }

  &:focus-within {
    background-color: #FFFFFF !important;
    border-color: #FFFFFF !important;
    box-shadow: 0px 6px 20px rgba(0, 0, 0, 0.20) !important;
    left: 0px !important;
    right: 0px !important;
`;

const Label = styled.div`
  font-weight: 800 !important;
  letter-spacing: 0.04em !important;
  font-size: 12px !important;
  line-height: 16px !important;
  padding-bottom: 2px !important;
`;

const SubmitIcon = styled.img`
  filter: brightness(0) saturate(100%) invert(99%) sepia(2%) saturate(1567%)
    hue-rotate(178deg) brightness(121%) contrast(100%);
  margin-right: 8px;
`;

const SubmitButton = styled(Button)`
  display: flex;
  border-radius: 24px;
  border: none;
  width: 100%;
  max-width: 180px;
  flex: 1 0 0% !important;
  background: linear-gradient(
    to right,
    rgb(30, 116, 137) 0%,
    rgb(31, 130, 133) 50%,
    rgb(30, 116, 137) 100%
  ) !important;
`;

function SearchBar(props) {
  const { onDateChange, onSubmit, endDate, startDate } = props;

  let isSameDay = false;
  if (startDate && endDate) isSameDay = sameDay(startDate, endDate);
  return (
    <div
      style={{ maxWidth: 850, borderRadius: 32 }}
      className="d-flex py-5 flex-column full-width flex-items-center"
    >
      <SearchContainer
        style={{ maxWidth: '100%' }}
        className=" place-items-center flex-justify-center flex-items-center full-width"
      >
        <SearchWrapper>
          <Label>Location</Label>
          <SearchInput placeholder="Where do you want to go?" className="p-2" />
        </SearchWrapper>
        <SearchWrapper>
          <Label>When</Label>
          <DatePickerInput
            placeholderText="When do you want to go? (Anytime)"
            className="p-2 full-width"
            dateFormat="MMMM d, yyyy"
            value={`${toMonthDayString(startDate)} ${
              endDate && !isSameDay ? ` - ${toMonthDayString(endDate)}` : ''
            }`}
            onChange={onDateChange}
            startDate={startDate}
            endDate={endDate}
            shouldCloseOnSelect={false}
            selectsRange
          />
        </SearchWrapper>
        <SubmitButton
          className="flex-items-center flex-justify-center"
          onClick={onSubmit}
        >
          <SubmitIcon height={28} width={24} src={searchIcon} />
          <h4 className="f3">Submit</h4>
        </SubmitButton>
      </SearchContainer>
    </div>
  );
}

SearchBar.propTypes = {
  onDateChange: PropTypes.func.isRequired,
  onLocationChange: PropTypes.func,
  startDate: PropTypes.object,
  endDate: PropTypes.object,
  onSubmit: PropTypes.func.isRequired,
};

export default SearchBar;
