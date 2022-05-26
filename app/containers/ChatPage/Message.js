'use es6';

import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { DateTime } from 'luxon';
import { MESSAGE_TYPES } from './constants';
import ChatBookingContainer from './ChatBookingContainer';

const MessageWrapper = styled.div`
  background-color: ${({ senderIsViewer }) =>
    senderIsViewer ? '#DDC3F8' : '#F6F8FA'};
  color: black;
  padding: 8px;
  border-radius: 8px;
  padding-left: 12px;
  padding-bottom: 8px;
  word-break: break-word;
`;

function Message({ message, senderIsViewer, senderName }) {
  const { content, createdAt, extraData } = message;
  const messageData = JSON.parse(extraData) || { type: MESSAGE_TYPES.MESSAGE };
  const [createdAtDate, _] = useState(
    DateTime.fromISO(createdAt, { zone: 'utc' }).toLocal(),
  );
  const formattedDate = createdAtDate.toLocaleString(DateTime.DATETIME_MED);

  const Header = useMemo(() => {
    switch (messageData.type) {
      case MESSAGE_TYPES.BOOKING: {
        return 'Booking Request';
      }
      case MESSAGE_TYPES.BOOKING_ACCEPTED: {
        return 'Booking Accepted';
      }
      case MESSAGE_TYPES.BOOKING_MODIFIED: {
        return 'Booking Modified';
      }
      case MESSAGE_TYPES.BOOKING_DECLINED: {
        return 'Booking Declined';
      }
      default:
        return '';
    }
  });

  // / disable avatar image for now
  return (
    <div
      className={`d-flex roboto p-3 bg-blue flex-items-center  ${
        senderIsViewer ? 'flex-row-reverse' : ''
      }`}
    >
      {false && (
        <img
          src="http://via.placeholder.com/250"
          className="circle mx-3 mt-1"
          height={36}
          width={36}
          alt="profile"
        />
      )}
      <div className="d-flex flex-column roboto">
        <div className="d-flex flex-items-center">
          <b className="roboto f5 mr-3">{senderName}</b>
          <p className="color-gray f5 roboto"> {formattedDate}</p>
        </div>
        <MessageWrapper className="roboto" senderIsViewer={senderIsViewer}>
          <p className="h3 roboto">{Header}</p>
          {content}{' '}
          {messageData.type !== MESSAGE_TYPES.MESSAGE && (
            <ChatBookingContainer message={message} />
          )}
        </MessageWrapper>
      </div>
    </div>
  );
}

Message.propTypes = {
  message: PropTypes.object,
  senderIsViewer: PropTypes.bool,
  senderName: PropTypes.string,
};

export default Message;
