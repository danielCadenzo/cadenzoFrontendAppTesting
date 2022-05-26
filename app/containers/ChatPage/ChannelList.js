import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { graphql, useLazyLoadQuery } from 'react-relay';
import ChannelItemContainer from './ChannelItemContainer';

const Container = styled.div`
  max-width: 300px;
  min-width: 200px;
  width: 100%;
  height: calc(100% - 66px) !important;
  overflow: hidden !important;
  opacity: 1 !important;
  transition-duration: 150ms !important;
  transition-delay: 350ms !important;

  background: #f6f8fa;
  border: 4px solid #f0f1f2;
  box-sizing: border-box;
  border-radius: 20px;
  margin: 0 16px;
`;

const QUERY = graphql`
  query ChannelListQuery($id: ID!) {
    profile(id: $id) {
      __typename
      ... on ArtistNode {
        chatrooms {
          isDm
          id
          name
          bookingRequests {
            id
            status
            performer {
              name
            }
            lineupSlot
            stipulations
            guarantee
            revenueSplit
            revenueSplitAmount
          }
          business {
            id
            name
            avatar
            address {
              formatted
            }
          }
        }
      }
      ... on VenueNode {
        chatrooms {
          isDm
          id
          name
          members {
            edges {
              node {
                connectedProfile {
                  ... on ArtistNode {
                    name
                    avatar
                  }
                }
              }
            }
          }
          bookingRequests {
            id
            status
            performer {
              name
            }
            lineupSlot
            stipulations
            guarantee
            revenueSplit
            revenueSplitAmount
          }
          business {
            id
            name
            avatar
            address {
              formatted
            }
          }
        }
      }
    }
  }
`;

function ChannelList({ onSelectChat, selectedChatId, profileId }) {
  const data = useLazyLoadQuery(QUERY, {
    id: profileId,
  });

  useEffect(() => {
    if (selectedChatId) {
      onSelectChat(
        selectedChatId,
        data.profile.chatrooms.find(channel => channel.id === selectedChatId),
      );
    }
  }, [selectedChatId]);

  return (
    <Container className="d-flex flex-column p-3 full-height border-right">
      {data &&
        data.profile &&
        data.profile.chatrooms.map(channel => (
          <ChannelItemContainer
            {...channel}
            viewerIsVenue={data.profile.__typename === 'VenueNode'}
            onSelectChat={onSelectChat}
            channel={channel}
          />
        ))}
    </Container>
  );
}

ChannelList.propTypes = {
  onSelectChat: PropTypes.func.isRequired,
  profileId: PropTypes.string.isRequired,
  selectedChatId: PropTypes.string,
};

export default ChannelList;
