import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';
import DocumentTableRow from './DocumentTableRow';
import messages from './messages';

const TableWrapper = styled.div`
  min-width: 100%;
  color: #343a40;
`;

const RowHeader = styled.div`
  font-family: 'Work Sans';
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 19px;
  color: #495057;
`;

const Scroller = styled.div`
  width: 100%;
  max-height: 300px;
  overflow: auto;
`;

export function DocumentsTable({ bookings }) {
  return (
    <TableWrapper className="d-table table-fixed width-full">
      <div className="d-flex width-full border-bottom p-1">
        <RowHeader className="d-table-cell col-2">
          <FormattedMessage {...messages.date} />
        </RowHeader>
        <RowHeader className="d-table-cell col-5">
          <FormattedMessage {...messages.name} />
        </RowHeader>
        <RowHeader className="d-table-cell col-3">
          <FormattedMessage {...messages.numberOfDocuments} />
        </RowHeader>
        <RowHeader className="d-table-cell col-2" />
      </div>
      <Scroller>
        {bookings.map(booking => (
          <DocumentTableRow booking={booking} />
        ))}
      </Scroller>
      {bookings.length === 0 && (
        <span className="p-3 d-flex flex-justify-center full-width f2">
          No results
        </span>
      )}
    </TableWrapper>
  );
}

DocumentsTable.propTypes = {
  bookings: PropTypes.array.isRequired,
  isActiveProfileVenue: PropTypes.bool.isRequired,
  onBookingClick: PropTypes.func.isRequired,
};

export default DocumentsTable;
