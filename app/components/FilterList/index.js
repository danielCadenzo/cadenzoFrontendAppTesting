/* eslint-disable jsx-a11y/click-events-have-key-events */
/**
 *
 * FilterList
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import searchIcon from '../../images/icons/search.svg';

const ListWrapper = styled.div`
  padding: 8px;
  border: 2px solid #e1e4e8;
  border-radius: 4px;
  max-height: 400px;
  overflow-y: auto;
`;

const Text = styled.p`
  font-size: 14px;
`;

const Input = styled.input`
  background: #fafbfc;
  border-radius: 4px;
  border: none;
`;

const InputWrapper = styled.div`
  background: #fafbfc;
  border: 0.5px solid #586069;
  box-sizing: border-box;
  border-radius: 4px;
`;

function FilterList(props) {
  const { LabelComponent, label, onClick, placeholder, onChange } = props;

  const ListItem = ({ label }) => (
    <div className="d-flex" onClick={onClick}>
      <Text>{label}</Text>
    </div>
  );

  const renderedItems = props.items.map(item =>
    LabelComponent ? (
      <LabelComponent {...props} item={item} />
    ) : (
      <ListItem label={label} />
    ),
  );
  return (
    <ListWrapper>
      <InputWrapper className="p-2 d-flex">
        <img className="mr-1" alt="Search Icon" width={16} src={searchIcon} />
        <Input placeholder={placeholder} onChange={onChange} />
      </InputWrapper>
      {renderedItems}
    </ListWrapper>
  );
}

FilterList.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.string,
      props: PropTypes.object,
    }),
  ),
  ListComponent: PropTypes.node,
  onClick: PropTypes.func,
  placeholder: PropTypes.string,
};

FilterList.defaultProps = {
  placeholder: 'Search',
};

export default FilterList;
