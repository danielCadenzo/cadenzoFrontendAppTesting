/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import H2 from 'components/H2';
import { ATTENDEE_STATUS } from './constants';

const Wrapper = styled.div`
  min-width: 200px;
`;

const SelectionBox = styled.div`
  width: 25px;
  height: 25px;
  border: 1px solid grey;
  border-radius: 8px;
  margin-right: 8px;
  ${({ isSelected = false }) =>
    isSelected ? `background-color: blue;` : 'background-color: inherit;'}
`;

function SidebarItem({ name, value, isSelected, listHeadcount, onChange }) {
  return (
    <div onClick={() => onChange(value)} className="d-flex my-2 cursor-pointer">
      <SelectionBox isSelected={isSelected} />
      <span className="Truncate mr-2">
        <p className="Truncate-text"> {name} </p>
      </span>
      <p className="ml-auto pr-2"> {listHeadcount} </p>
    </div>
  );
}

SidebarItem.propTypes = {
  onChange: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.any,
  isSelected: PropTypes.bool,
  listHeadcount: PropTypes.number,
};

class ListSidebar extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { onChange, selectedValue, listCounts } = this.props;
    return (
      <Wrapper className="full-height border-right px-1 roboto">
        <H2 className="py-4">Guests</H2>
        <div>
          <SidebarItem
            name="Attendees"
            onChange={onChange}
            listHeadcount={listCounts[ATTENDEE_STATUS.ATTENDING]}
            isSelected={selectedValue === ATTENDEE_STATUS.ATTENDING}
            value={ATTENDEE_STATUS.ATTENDING}
          />
          <SidebarItem
            name="Checked-In"
            onChange={onChange}
            isSelected={selectedValue === ATTENDEE_STATUS.CHECKED_IN}
            listHeadcount={listCounts[ATTENDEE_STATUS.CHECKED_IN]}
            value={ATTENDEE_STATUS.CHECKED_IN}
          />
          <SidebarItem
            name="Resellers"
            onChange={onChange}
            listHeadcount={listCounts[ATTENDEE_STATUS.RESELLER]}
            isSelected={selectedValue === ATTENDEE_STATUS.RESELLER}
            value={ATTENDEE_STATUS.RESELLER}
          />
        </div>
      </Wrapper>
    );
  }
}

ListSidebar.propTypes = {
  onChange: PropTypes.func.isRequired,
  selectedValue: PropTypes.string.isRequired,
  listCounts: PropTypes.number,
};

export default ListSidebar;
