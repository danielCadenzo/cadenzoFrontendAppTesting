import styled from 'styled-components';
import React from 'react';
import H2 from 'components/H2';

const Wrapper = styled.div`
  margin: 0px auto !important;
  max-width: 66% !important;
  min-width: 66% !important;
  overflow-y: auto;
  height: 100%;
  min-height: 0;
  border-right: 2px #e1e4e8 solid !important;
`;

export default function() {
  return (
    <Wrapper>
      <H2 className="h2 pt-5 d-flex flex-justify-center">Select a chat</H2>
    </Wrapper>
  );
}
