/**
 *
 * ViewTicketPage
 *
 */

import React, { memo, useState, useMemo, useEffect, useCallback } from 'react';
import { useDidMount } from 'utils/customHooks';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import { compose } from 'redux';
import styled from 'styled-components';
import QrCode from 'components/QrCode';
import { BASE_URL, createGQLQuery } from 'data/api';
import * as RequestStates from 'redux/RequestStates';
import { darkgrey } from 'utils/CssVariables';
import { DateTime } from 'luxon';
import { DAY_MONTH_TIME_FORMAT } from 'utils/dates';

import messages from './messages';

const TicketWrapper = styled.div`
  border: 2px solid ${darkgrey};
  max-width: 720px;
  padding: 20px;
  border-radius: 8px;
`;

const QUERY = `
query($id: ID!, $tid: ID!){
  event(id: $id){
    title
    venueName
    address
    startDate
    endDate
  }
  ticket(id: $tid) {
    hasBeenUsed
  }
}
`;

const REFRESH_MS = 30000;

export function ViewTicketPage() {
  let timeoutFetch;

  const didMount = useDidMount();
  // eslint-disable-next-line no-unused-vars
  const [requestStatus, setRequestStatus] = useState(
    RequestStates.UNINITIALIZED,
  );
  const [eventInfo, setEventInfo] = useState(null);
  const [ticketInfo, setTicketInfo] = useState(null);
  const segments = window.location.pathname.split('/');

  useEffect(() => {
    const timer = setInterval(() => {
      if (ticketInfo && !ticketInfo.hasBeenUsed) {
        timeoutFetch();
      }
    }, REFRESH_MS);
    // clearing interval
    return () => clearInterval(timer);
  }, [ticketInfo]);

  const fetchTicketInfo = useCallback(() => {
    createGQLQuery(QUERY, { id: segments[3], tid: segments[4] })
      .then(data => {
        setRequestStatus(RequestStates.SUCCEEDED);
        setEventInfo(data.event);
        setTicketInfo(data.ticket);
      })
      .catch(() => setRequestStatus(RequestStates.FAILED));
  }, []);
  timeoutFetch = fetchTicketInfo;

  const renderQrCode = useMemo(() => {
    if (eventInfo) {
      return (
        <div className="d-flex flex-justify-center">
          <QrCode
            link={`${BASE_URL}/${segments[1]}/verify/${segments[3]}`}
            width="200px"
            height="200px"
          />
        </div>
      );
    }
  }, [eventInfo]);

  const renderHasBeenUsed = useMemo(() => {
    if (ticketInfo && ticketInfo.hasBeenUsed) {
      return (
        <div className="d-flex flex-justify-center">
          <p>
            <FormattedMessage {...messages.checkedIn} />
          </p>
        </div>
      );
    }
  }, [ticketInfo]);

  useEffect(() => {
    if (didMount) {
      fetchTicketInfo();
    }
  }, [didMount]);

  const renderEventInformation = () => {
    if (!eventInfo) return null;
    const { title, venueName, startDate, endDate, address } = eventInfo;
    const startTime = new DateTime.fromISO(startDate);
    const endTime = new DateTime.fromISO(endDate);

    return (
      <div className="d-flex flex-column flex-self-center">
        <p className="h2 work-sans-black flex-justify-start">{title}</p>
        {venueName && <p className="work-sans-black">{venueName}</p>}
        {address !== 'None' && <p className="work-sans-black">{address}</p>}

        <div className="d-flex">
          <p className="f4 work-sans-black flex-justify-start">
            {startTime.toFormat(DAY_MONTH_TIME_FORMAT)}
          </p>
          <p className="mx-2">-</p>
          <p className="f4 work-sans-black flex-justify-start">
            {endTime.toFormat(DAY_MONTH_TIME_FORMAT)}
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="full-width d-flex flex-justify-center ">
      <Helmet>
        <title>Cadenzo | View Your Ticket</title>
        <meta name="description" content="View Your Ticket For The Event" />
      </Helmet>
      <TicketWrapper className="flex-items-center flex-justify-center d-flex mt-4 flex-column">
        <div>
          <p className="h1 my-3 work-sans-black text-center">Your Ticket</p>
          {renderQrCode}
          {renderEventInformation()}
          {renderHasBeenUsed}
        </div>
      </TicketWrapper>
    </div>
  );
}

ViewTicketPage.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

const withConnect = connect(
  null,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  memo,
)(ViewTicketPage);
