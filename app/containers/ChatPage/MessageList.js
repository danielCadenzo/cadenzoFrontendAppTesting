'use es6';

import React from 'react';
import PropTypes from 'prop-types';
import Message from './Message';

function MessageList({
  messages,
  viewerEmail,
  isBusinessUser,
  business,
  activeProfileName,
  activeProfileRootId,
  isActiveProfileArtist,
}) {
  return (
    <div className="d-flex flex-column-reverse py-3">
      {messages.map(message => {
        const isSenderMessage = activeProfileRootId === message.node.sender.id;
        const senderName =
          // eslint-disable-next-line no-nested-ternary
          activeProfileRootId === message.node.sender.id
            ? activeProfileName
            : isActiveProfileArtist
              ? business.name
              : message.node.sender.connectedProfile.name;

        return (
          <Message
            senderIsViewer={isSenderMessage}
            businessName={business && business.name}
            senderName={senderName}
            isBusinessUser={isBusinessUser}
            viewerId={viewerEmail}
            message={{ ...message.node }}
          />
        );
      })}
    </div>
  );
}

MessageList.propTypes = {
  messages: PropTypes.array,
  viewerEmail: PropTypes.string,
  isBusinessUser: PropTypes.bool,
  business: PropTypes.object,
  activeProfileName: PropTypes.string.isRequired,
  activeProfileRootId: PropTypes.string,
  isActiveProfileArtist: PropTypes.bool,
};

MessageList.defaultProps = {};

export default MessageList;
