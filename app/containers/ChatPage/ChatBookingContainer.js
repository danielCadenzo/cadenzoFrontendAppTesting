import React, { memo, useMemo, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { graphql, useLazyLoadQuery } from 'react-relay';
import { FormattedMessage } from 'react-intl';
import Button from 'components/Button';
import BookingModal from 'containers/CreatorHomeDashboard/BookingModal';
import { MESSAGE_TYPES } from './constants';
import messages from './messages';

const FETCH_BOOKING_REQUEST = graphql`
  query ChatBookingContainerRequestQuery($id: ID) {
    bookingRequest(id: $id) {
      id
      startDate
      guarantee
      status
      stipulations
      endDate
      initiator
      lineupSlot
      revenueSplit
      revenueSplitAmount
      performanceLength
      venue {
        id
        preferredPerformances
        avatar
        name
      }
      performer {
        instagramProfile
        spotifyProfile
        name
        id
        genres
        youtubeProfile
        soundcloudProfile
        avatar
        applemusicProfile
        twitterProfile
      }
    }
  }
`;

const FETCH_BOOKING_DETAIL = graphql`
  query ChatBookingContainerDetailQuery($id: ID) {
    bookingDetail(id: $id) {
      guarantee
      startDate
      endDate
      revenueSplit
      performanceTypes
      revenueSplitAmount
      stipulations
      venue {
        id
        facebookProfile
        preferredPerformances
      }
      performer {
        instagramProfile
        spotifyProfile
        id
        genres
        youtubeProfile
        soundcloudProfile
        applemusicProfile
        twitterProfile
      }
    }
  }
`;

function ChatBookingContainer({ message }) {
  const { extraData } = message;
  const [showModal, updateShowModal] = useState(false);
  const parsedData = useMemo(() => JSON.parse(extraData), [extraData]);
  const messageIsRequest = useMemo(
    () =>
      [
        MESSAGE_TYPES.BOOKING_REQUESTED,
        MESSAGE_TYPES.BOOKING_MODIFIED,
        MESSAGE_TYPES.BOOKING_DECLINED,
      ].includes(parsedData.type),
    [parsedData.type],
  );
  const query = messageIsRequest ? FETCH_BOOKING_REQUEST : FETCH_BOOKING_DETAIL;
  const bookingId = parsedData.booking_id || parsedData.booking_request_id;
  const data = useLazyLoadQuery(query, { id: bookingId });

  const toggleModal = useCallback(() => updateShowModal(!showModal));

  if (!data) return <p>Loading...</p>;
  const bookingAccessProperty = messageIsRequest
    ? 'bookingRequest'
    : 'bookingDetail';
  
  return (
    <div>
      {showModal && (
        <BookingModal
          booking={data[bookingAccessProperty]}
          isOpen={showModal}
          readOnly={
            !messageIsRequest ||
            (messageIsRequest && data[bookingAccessProperty] !== 'P')
          }
          venueId={data[bookingAccessProperty].venue.id}
          onClose={toggleModal}
        />
      )}
      {message.content && message.content.length > 0 && (
        <>
          <hr />{' '}
          <p className="text-bold">
            <FormattedMessage {...messages[parsedData.type]} />
          </p>
        </>
      )}
      <Button onClick={toggleModal} className="px-4">
        <FormattedMessage {...messages.view} />
      </Button>
    </div>
  );
}

ChatBookingContainer.propTypes = {
  message: PropTypes.object,
};

export default memo(ChatBookingContainer);
