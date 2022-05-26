import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { graphql, useMutation } from 'react-relay';
import Button from 'components/Button';

const ChatInput = styled.textarea`
  width: 100%;
  min-width: 0;
  height: 60px;
  padding: 12px;
  background: #f6f8fa;
  border: 3px solid #f0f1f2;
  box-sizing: border-box;
  border: 4px solid #f0f1f2;
  border-radius: 10px;
`;

const Wrapper = styled.div`
  bottom: 0;
  position: sticky;
  background-color: white;
`;

const ChatField = ({ chatRoomId, activeProfileRootId, onNewMessageSent }) => {
  const [textInput, setTextInput] = useState('');
  const [commit, isInFlight] = useMutation(graphql`
    mutation ChatFieldMutation(
      $input: String!
      $sender: ID
      $chatroom: String
    ) {
      sendChatMessage(chatroom: $chatroom, sender: $sender, text: $input) {
        success
        message {
          content
          createdAt
          extraData
          sender {
            username
            id
            connectedProfile {
              ... on ArtistNode {
                name
              }
            }
          }
        }
      }
    }
  `);

  const handleSubmit = useCallback(evt => {
    if (textInput.length) {
      commit({
        variables: {
          input: textInput,
          sender: activeProfileRootId,
          chatroom: chatRoomId,
        },
        onCompleted: data => {
          onNewMessageSent(data.sendChatMessage.message);
          setTextInput('');
        },
      });
    }
  });

  const onChange = useCallback(evt => {
    setTextInput(evt.target.value);
  });

  return (
    <Wrapper className="d-flex full-width p-5 mt-auto flex-items-center border-top">
      <ChatInput
        placeholder="Enter your message"
        aria-placeholder="Enter your message"
        onChange={onChange}
        value={textInput}
      />
      <Button
        className="px-4 d-flex"
        disabled={!textInput.length}
        onClick={handleSubmit}
      >
        <p className="flex-shrink-0"> Send </p>
      </Button>
    </Wrapper>
  );
};

ChatField.propTypes = {
  chatRoomId: PropTypes.string.isRequired,
  activeProfileRootId: PropTypes.string.isRequired,
  onNewMessageSent: PropTypes.func.isRequired,
};

export default ChatField;
