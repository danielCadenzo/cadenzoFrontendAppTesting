/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { memo, useCallback } from 'react';
import PropTypes from 'prop-types';
import UIAvatar from 'components/UIAvatar/Loadable';
import styled from 'styled-components';

const Name = styled.div`
  -webkit-box-flex: 1 !important;
  white-space: nowrap !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
  flex-grow: 1 !important;
`;

const NameContainer = styled.div`
  -webkit-box-direction: normal !important;
  -webkit-box-orient: horizontal !important;
  min-height: 20px !important;
  color: rgb(34, 34, 34) !important;
  margin-right: 10px !important;
  font-size: 16px !important;
  line-height: 20px !important;
  display: flex !important;
  flex-direction: column !important;
`;

const ChannelItemContainer = props => {
  const { business, id, onSelectChat, channel, viewerIsVenue, members } = props;

  const selectChannel = useCallback(() => {
    onSelectChat(id, channel);
  }, []);

  const associatedArtist =
    viewerIsVenue &&
    members.edges.find(
      ({ node }) => node.connectedProfile && node.connectedProfile.name,
    );

  const chatName = viewerIsVenue
    ? associatedArtist && associatedArtist.node.connectedProfile.name
    : business.name;

  const channelAvatar = viewerIsVenue
    ? associatedArtist.node.connectedProfile.avatar
    : business.avatar;

  return (
    <div
      onClick={selectChannel}
      className="circle d-flex full-width flex-items-center my-2"
    >
      <div className="d-flex flex-column">
        <UIAvatar avatarUrl={channelAvatar} profileName={chatName} />
      </div>
      <NameContainer className="d-flex flex-column ml-2">
        <Name>{chatName}</Name>
      </NameContainer>
    </div>
  );
};

ChannelItemContainer.propTypes = {
  onSelectChat: PropTypes.func.isRequired,
  business: PropTypes.object.isRequired,
  id: PropTypes.string.isRequired,
  channel: PropTypes.object,
  viewerIsVenue: PropTypes.bool.isRequired,
  members: PropTypes.array,
};

export default memo(ChannelItemContainer);
