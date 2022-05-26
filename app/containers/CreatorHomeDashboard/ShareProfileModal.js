import React, { useState } from 'react';
import styled from 'styled-components';
import { TextField } from '@material-ui/core';
import { BASE_URL } from 'data/api';
import Check from '@material-ui/icons/CheckRounded';
import Button from '../../components/Button';

const DirectLinkText = styled.h2`
  font-weight: bold;
  margin-bottom: 10px;
`;

const DescriptionText = styled.h3`
  color: grey;
  font-weight: 500;
  margin-bottom: 10px;
`;

const ShareWrapper = styled.div`
  display: flex;
`;

const URLTextField = styled(TextField)`
  width: 75%;
`;

const CopyButton = styled(Button)`
  margin: 0;
  margin-left: 10px;
  padding: 17px;
`;

export function ShareProfileModal(props) {
  const [copied, setCopied] = useState(false);

  function handleCopyClick() {
    navigator.clipboard.writeText(`${BASE_URL}${props.viewProfileLink}`);
    setCopied(true);
  }
  return (
    <>
      <DirectLinkText> Direct Link</DirectLinkText>
      <DescriptionText>
        {' '}
        You can share the direct link to your booking profile
      </DescriptionText>
      <ShareWrapper>
        <URLTextField
          value={`${BASE_URL}${props.viewProfileLink}`}
          variant="filled"
          InputProps={{
            readOnly: true,
          }}
        />
        <CopyButton onClick={handleCopyClick}>
          {copied && <Check />}
          {!copied && <h3>Copy</h3>}
        </CopyButton>
      </ShareWrapper>
    </>
  );
}
