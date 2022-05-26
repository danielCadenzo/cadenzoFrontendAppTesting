import React, { useState, useMemo } from 'react';
import styled from 'styled-components';
import { cadenzoPrimary } from 'utils/CssVariables';
import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { fromServerTime } from 'utils/dates';
import { DASHBOARD_TABS } from './constants';

import messages from './messages';
import BookingsTable from './BookingTable';
import DocumentsTable from './DocumentsTable';

const DashboardHeader = styled.button`
  font-family: 'Work Sans';
  font-style: normal;
  font-weight: 500;
  font-size: 18px;
  line-height: 21px;
  color: ${({ isActive }) => (isActive ? cadenzoPrimary : '#9f9f9f')};
  padding: 0 8px;
  border: none;
  background: none;
`;

const Wrapper = styled.div`
  background: #ffffff;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  border-radius: 6px;
  width: 90%;
  padding: 8px;
  margin: 0 auto;
`;

export function DashboardTables({
  intl,
  isActiveProfileVenue,
  bookingRequests,
  upcomingBookings,
  cancelledBookings,
  onBookingClick,
}) {
  const [activeTab, setActiveTab] = useState(DASHBOARD_TABS.REQUESTS);

  const handleClick = e => {
    setActiveTab(e.target.dataset.tabType);
  };

  const activeListings = useMemo(() => {
    let unSortedListings = [];
    if (activeTab === DASHBOARD_TABS.REQUESTS)
      unSortedListings = bookingRequests;
    if (activeTab === DASHBOARD_TABS.UPCOMING_SHOWS)
      unSortedListings = upcomingBookings;
    if (activeTab === DASHBOARD_TABS.CANCELLED_SHOWS)
      unSortedListings = cancelledBookings;
    if (activeTab === DASHBOARD_TABS.DOCUMENTS)
      unSortedListings = upcomingBookings;
    return unSortedListings.sort((o1, o2) => {
      const converted1 = fromServerTime(o1.startDate);
      const converted2 = fromServerTime(o2.startDate);
      if (converted1 < converted2) return -1;
      if (converted1 > converted2) return 1;
      return 0;
    });
  }, [activeTab, bookingRequests, upcomingBookings, cancelledBookings]);

  const TableHeader = useMemo(
    () =>
      Object.keys(DASHBOARD_TABS).map(tabType => (
        <div className="d-table-cell col-3">
          <DashboardHeader
            hidden={
              !isActiveProfileVenue && tabType === DASHBOARD_TABS.DOCUMENTS
            }
            onClick={handleClick}
            isActive={activeTab === tabType}
          >
            <span data-tab-type={tabType}>
              {intl.formatMessage(messages[tabType])}
            </span>
          </DashboardHeader>
        </div>
      )),
    [activeTab],
  );
  return (
    <Wrapper>
      <div className="d-table table-fixed width-full p-3">{TableHeader}</div>
      {activeTab !== DASHBOARD_TABS.DOCUMENTS && (
        <BookingsTable
          isActiveProfileVenue={isActiveProfileVenue}
          onBookingClick={onBookingClick}
          bookings={activeListings}
        />
      )}

      {activeTab === DASHBOARD_TABS.DOCUMENTS && (
        <DocumentsTable bookings={activeListings} />
      )}
    </Wrapper>
  );
}

DashboardTables.propTypes = {
  bookingRequests: PropTypes.array,
  cancelledBookings: PropTypes.array,
  upcomingBookings: PropTypes.array,
  isActiveProfileVenue: PropTypes.bool.isRequired,
  onBookingClick: PropTypes.func.isRequired,
  intl: PropTypes.object,
};

export default injectIntl(DashboardTables);
