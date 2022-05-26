/**
 *
 * Table
 *
 */

import React, { memo } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {
  useTable,
  useFilters,
  useGlobalFilter,
  useAsyncDebounce,
} from 'react-table';
import MaUTable from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import GlobalFilter from './SearchFilter';
import { deviceMax } from '../../constants/ResponsiveSizing/deviceSize';

const TCell = styled(TableCell)`
  max-width: 125px;
  min-width: 125px;
  padding: 0 !important;
  overflow-x: auto;
  white-space: nowrap;
  text-align: center !important;
`;

const TableFoot = styled.tfoot`
  padding: 16px !important;
  display: table;
  width: 100%;
`;

const TableContainer = styled.div`
  overflow-x: auto;
  margin-right: auto;
  margin-left: auto;
  margin-top: 50px;
  padding: 10px;

  @media ${deviceMax.mobileL} {
    margin-left: auto;
    margin-right: auto;
  }
`;

function Table(props) {
  const {
    data,
    columns,
    showHeaders,
    footerContent,
    showFooter,
    actionColumn,
  } = props;

  const memoizedCols = React.useMemo(() => columns, []);
  const updateSearch = e => {
    const { onFilterValueChange } = props;
    if (onFilterValueChange) {
      onFilterValueChange(e.target.value);
    }
  };
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    footerGroups,
    rows,
    prepareRow,
    state,
    visibleColumns,
    preGlobalFilteredRows,
    setGlobalFilter,
  } = useTable(
    {
      columns: memoizedCols,
      data,
      defaultColumn: {}, // Be sure to pass the defaultColumn option
      filterTypes: React.memo(() => {}, []),
    },
    actionColumn,
    useFilters, // useFilters!
    useGlobalFilter, // useGlobalFilter!
  );

  const rowOrHeaderStyles = {};
  return (
    <div>
      <TableContainer>
        <MaUTable {...getTableProps()}>
          <TableHead>
            <TableRow>
              <GlobalFilter
                preGlobalFilteredRows={preGlobalFilteredRows}
                globalFilter={state.globalFilter}
                setGlobalFilter={setGlobalFilter}
              />
            </TableRow>
            {showHeaders &&
              headerGroups.map(headerGroup => (
                <TableRow {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map(column => (
                    <TCell {...column.getHeaderProps()}>
                      {column.render('Header')}
                    </TCell>
                  ))}
                </TableRow>
              ))}
          </TableHead>
          <TableBody {...getTableBodyProps()}>
            {rows.map(row => {
              prepareRow(row);

              return (
                <TableRow {...row.getRowProps()} style={rowOrHeaderStyles}>
                  {row.cells.map(cell => {
                    const cellProps = cell.column.getCellProps
                      ? cell.column.getCellProps()
                      : {};
                    return (
                      <TCell {...cell.getCellProps()} {...cellProps}>
                        {cell.render('Cell')}
                      </TCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
          <TableFoot>
            {showFooter &&
              footerGroups.map(group => (
                <TableRow {...group.getFooterGroupProps()}>
                  {group.headers.map(column => (
                    <TableCell {...column.getFooterProps()}>
                      {column.render('Footer')}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
          </TableFoot>
        </MaUTable>
        <br />
        {footerContent}
      </TableContainer>
    </div>
  );
}

Table.propTypes = {
  cellProps: PropTypes.object,
  onChange: PropTypes.func,
  wrapperStyle: PropTypes.object,
  data: PropTypes.arrayOf(PropTypes.object),
  columns: PropTypes.arrayOf(PropTypes.object),
  filterAccessor: PropTypes.string.isRequired,
  onFilterValueChange: PropTypes.func,
  actionButtons: PropTypes.arrayOf(PropTypes.func),
  showHeaders: PropTypes.bool,
  footerContent: PropTypes.node,
  showFooter: PropTypes.bool,
  onRowSelect: PropTypes.func,
  actionColumn: PropTypes.func,
};

Table.defaultProps = {
  showHeaders: true,
  footerContent: null,
  showFooter: false,
};

export default memo(Table);
