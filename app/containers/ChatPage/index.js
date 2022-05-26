/**
 *
 * ChatPageJs
 *
 */

import React, { memo, useState, Fragment, useCallback } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { compose } from 'redux';
import styled from 'styled-components';
import { getJsonFromUrl, updateURLParameter } from 'utils/helpers';
import * as AuthSelectors from 'data/selectors/authSelectors';

import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';
import EmptyState from 'containers/CreatorHomeDashboard/EmptyState';
import reducer from './reducer';
import saga from './saga';
import ChannelList from './ChannelList';
import MessageSection from './MessageSection';
import BookingDetailSection from './BookingDetailSection';

const OverflowContainer = styled.div`
  height: calc(100% - 66px) !important;
`;

const CHAT_ID_PARAM = 'chatId';
export function ChatPage(props) {
  const [selectedChatId, onSelectChat] = useState(getJsonFromUrl().chatId);
  const [selectedChannel, onChangeChannel] = useState();
  const [isViewingBooking, setViewBooking] = useState(false);
  const {
    username,
    activeProfileId,
    isActiveProfileArtist,
    activeProfileName,
    activeProfileRid,
  } = props;
  const chatroomHasBooking =
    selectedChannel &&
    selectedChannel.bookingRequests.length &&
    selectedChannel.bookingRequests[0].status === 'PENDING';

  const handleChatChange = useCallback((chatId, selectedChannel) => {
    window.history.replaceState(
      '',
      '',
      updateURLParameter(window.location.href, CHAT_ID_PARAM, chatId),
    );
    onSelectChat(chatId);
    onChangeChannel(selectedChannel);
  });

  useInjectReducer({ key: 'chatPage', reducer });
  useInjectSaga({ key: 'chatPage', saga });

  return (
    <OverflowContainer className="d-flex roboto full-height p-2">
      <Helmet>
        <title>Messages | Cadenzo</title>
        <meta
          name="description"
          content="View all your booking messages on Cadenzo"
        />
      </Helmet>
      {activeProfileId && (
        <Fragment>
          <div className="full-height d-flex">
            <ChannelList
              profileId={activeProfileId}
              selectedChatId={selectedChatId}
              onSelectChat={handleChatChange}
            />
          </div>
          {selectedChatId && (
            <MessageSection
              userEmail={username}
              viewerId={activeProfileId}
              activeProfileName={activeProfileName}
              selectedChatId={selectedChatId}
              setViewBooking={setViewBooking}
              hasActiveRequest={chatroomHasBooking}
              activeProfileRid={activeProfileRid}
              isActiveProfileArtist={isActiveProfileArtist}
            />
          )}
          {isViewingBooking && chatroomHasBooking && (
            <BookingDetailSection
              activeProfileId={activeProfileId}
              channel={selectedChannel}
            />
          )}
        </Fragment>
      )}
      {!activeProfileId && <EmptyState />}
    </OverflowContainer>
  );
}

ChatPage.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

ChatPage.defaultProps = {};

const mapStateToProps = state => ({
  activeProfileId: AuthSelectors.getActiveProfileId(state),
  username: AuthSelectors.getEmail(state),
  activeProfileName: AuthSelectors.getActiveArtistProfileName(state),
  activeProfileRid: AuthSelectors.getActiveProfileRootId(state),
  isActiveProfileArtist: AuthSelectors.getIsActiveProfileAnArtist(state),
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

export default compose(
  withConnect,
  memo,
)(ChatPage);
