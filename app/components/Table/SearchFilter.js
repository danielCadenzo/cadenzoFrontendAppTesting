import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useAsyncDebounce } from 'react-table';
import searchIcon from '../../images/icons/search.svg';

const SearchContainer = styled.span`
  background: #fafbfc;
  border: 0.5px solid #586069;
  box-sizing: border-box;
  border-radius: 4px;
`;

function GlobalFilter({
  preGlobalFilteredRows,
  globalFilter,
  setGlobalFilter,
}) {
  const count = preGlobalFilteredRows.length;
  const [value, setValue] = React.useState(globalFilter);
  const onChange = useAsyncDebounce(value => {
    setGlobalFilter(value || undefined);
  }, 200);

  return (
    <SearchContainer
      className="p-2 d-flex full-width"
      style={{ backgroundColor: 'white' }}
    >
      <img src={searchIcon} />
      <input
        className="full-width px-2"
        value={value || ''}
        onChange={e => {
          setValue(e.target.value);
          onChange(e.target.value);
        }}
        placeholder={`${count} records...`}
        style={{
          fontSize: '1.1rem',
          border: '0',
        }}
      />
    </SearchContainer>
  );
}
GlobalFilter.propTypes = {
  preGlobalFilteredRows: PropTypes.array,
  globalFilter: PropTypes.func,
  setGlobalFilter: PropTypes.func,
};

export default GlobalFilter;
