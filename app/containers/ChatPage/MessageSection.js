import React, { memo, useState, useCallback, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { graphql, useLazyLoadQuery } from 'react-relay';
import Routes from 'data/Routes';
import ChatField from './ChatField';
import MessageSectionHeader from './MessageSectionHeader';
import MessageList from './MessageList';

const ChatContainer = styled.div`
  margin: 0px auto !important;
  max-width: 66% !important;
  overflow-y: auto;
  height: 100%;
  min-height: 0;
  max-height: calc(100% - 66px);
  position: relative;
  width: 100%;
  background: #ffffff;
  border: 2px solid #f0f1f2;
  box-sizing: border-box;
  box-shadow: 0px 6px 20px rgba(0, 0, 0, 0.1);
  border-radius: 20px;
`;

const MESSAGES_QUERY = graphql`
  query MessageSectionQuery($id: ID!) {
    chatroom(id: $id) {
      isVenueAdmin
      databaseId
      business {
        id
        images
        name
        rEmail
        rId
        admins {
          id
          email
        }
      }
      members {
        edges {
          node {
            connectedProfile {
              ... on ArtistNode {
                name
                id
                avatar
              }
            }
          }
        }
      }
      messages {
        edges {
          node {
            content
            createdAt
            extraData
            sender {
              username
              id
              connectedProfile {
                ... on ArtistNode {
                  name
                  id
                }
              }
            }
          }
        }
      }
    }
  }
`;

function MessageSection(props) {
  const {
    selectedChatId,
    viewerId,
    setViewBooking,
    activeProfileName,
    isActiveProfileArtist,
    activeProfileRid,
  } = props;
  const [newSentMessages, setSentMessages] = useState([]);
  const [flag, setFlag] = useState(false);

  const data = useLazyLoadQuery(
    MESSAGES_QUERY,
    { id: selectedChatId },
    { fetchPolicy: 'store-and-network' },
  );

  const handleNewMessageSent = useCallback(message =>
    setSentMessages(newSentMessages.concat([{ node: message }])),
  );

  const scrollBottomRef = useRef(null);

  function refreshPage() {
    if (flag === false) {
      setFlag(true);
      scrollBottomRef.current.scrollTop = 9999;
      alert('entered')
    }
  }

  const scrollToBottom = useCallback(() => {
    scrollBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    refreshPage();
  });

  useEffect(() => scrollToBottom(), []);

  if (!selectedChatId) return null;

  const associatedArtist =
    data.chatroom.business.rId === activeProfileRid &&
    data.chatroom.members.edges.find(
      ({ node }) => node.connectedProfile && node.connectedProfile.name,
    );

  const chatName =
    data.chatroom.business.rId === activeProfileRid
      ? associatedArtist && associatedArtist.node.connectedProfile.name
      : data.chatroom.business.name;

  const profileLink =
    data.chatroom.business.rId === activeProfileRid
      ? Routes.artistBookingPage(
          associatedArtist && associatedArtist.node.connectedProfile.id,
        )
      : Routes.venueBookingPage(data.chatroom.business.id);

  return (
    <div className="d-flex full-width full-height flex-column">
      <ChatContainer>
        <MessageSectionHeader
          contactName={chatName}
          contactLink={profileLink}
          onViewRequest={() => setViewBooking(true)}
        />
        {!selectedChatId && <h2 className="h2 p-4">Select a Chat</h2>}
        {selectedChatId && data.chatroom && (
          <MessageList
            business={data.chatroom.business}
            bussinessrId={data.chatroom.business.rId}
            isActiveProfileArtist={isActiveProfileArtist}
            activeProfileName={activeProfileName}
            activeProfileRootId={activeProfileRid}
            messages={newSentMessages.concat(data.chatroom.messages.edges)}
            onNewMessageSent={handleNewMessageSent}
          />
        )}
        <div
          ref={el => {
            scrollBottomRef.current = el;
          }}
        />
        <ChatField
          onNewMessageSent={handleNewMessageSent}
          chatRoomId={data.chatroom.databaseId}
          viewerId={viewerId}
          activeProfileRootId={activeProfileRid}
        />
      </ChatContainer>
    </div>
  );
}

MessageSection.propTypes = {
  setViewBooking: PropTypes.func.isRequired,
  isActiveProfileArtist: PropTypes.bool.isRequired,
  viewerId: PropTypes.string.isRequired,
  selectedChatId: PropTypes.string.isRequired,
  activeProfileName: PropTypes.string.isRequired,
  activeProfileRid: PropTypes.string.isRequired,
};

export default memo(MessageSection);
