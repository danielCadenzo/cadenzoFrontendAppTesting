/**
 *
 * StreamPage
 *
 */

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';
import { createGQLQuery } from 'data/api';
import { toMonthDayString } from 'utils/dates';
import makeSelectStreamPage from './selectors';
import reducer from './reducer';
import saga from './saga';
import VideoPlayer from './VidePlayer';
import { TICKET_EVENT_FETCH } from './queries';

const videoJsOptions = {
  autoplay: true,
  controls: true,
  chromecast: {
    appId: '8AEB6EF7',
  },
  sources: [
    {
      src:
        'https://player.vimeo.com/external/464549946.hd.mp4?s=c327a50c2c36f9558b71b11ad80bbde3ab71971b&profile_id=174',
      type: 'video/mp4',
    },
    {
      src:
        'https://player.vimeo.com/external/464549946.hd.mp4?s=c327a50c2c36f9558b71b11ad80bbde3ab71971b&profile_id=174',
      type: 'video/mp4',
    },
  ],
};

export function StreamPage() {
  useInjectReducer({ key: 'streamPage', reducer });
  useInjectSaga({ key: 'streamPage', saga });

  const [ticketID, onticketID] = useState(
    window.location.pathname.split('/')[1],
  );

  const renderTicketMessage = () => {};

  const [event, updateEvent] = useState(null);
  const [eventLookUpFailed, onEventLookUpFailed] = useState(false);
  const [eventIsNotToday, onEventIsNotToday] = useState(false);
  if (!event) {
    createGQLQuery(TICKET_EVENT_FETCH, { id: ticketID }).then(data => {
      if (data.tickets && data.tickets.edges.length > 0) {
        const { node } = data.tickets.edges[0];
        const { event } = node;
        const today = new Date().getDate();
        const eventDate = new Date(event.startDate).getDate();
        if (today !== eventDate) onEventIsNotToday(true);
        updateEvent(event);
        onEventLookUpFailed(false);
      } else {
        onEventLookUpFailed(true);
      }
    });
  }

  return (
    <div className="full-height full-width d-flex flex-column">
      <script src="https://www.gstatic.com/cv/js/sender/v1/cast_sender.js?loadCastFramework=1" />

      <Helmet>
        <title>Cadenzo Events</title>
        <head data-cast-api-enabled="true" />
        <meta name="description" content="Cadenzo Events Streaming" />
      </Helmet>
      <h3 className="f3 text-center my-3">{event ? event.title : null}</h3>
      <div className="full-height full-width d-flex text-center">
        {eventLookUpFailed && (
          <h3 className="f3 mt-4 full-width text-center">
            Something went wrong, perhaps your streaming from a different IP?
            Refresh your browser{' '}
          </h3>
        )}
        {!eventLookUpFailed && event && eventIsNotToday && (
          <h3 className="f3 mt-4 full-width text-center">
            Your event will be available{' '}
            {toMonthDayString(new Date(event.startDate))}
          </h3>
        )}
        {event && !eventLookUpFailed && !eventIsNotToday && (
          <VideoPlayer {...videoJsOptions} />
        )}
      </div>
    </div>
  );
}

StreamPage.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  streamPage: makeSelectStreamPage(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(withConnect)(StreamPage);
