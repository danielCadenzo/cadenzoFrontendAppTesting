import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Wrapper = styled.div`
  background-color: #e5e5e5;
  border-radius: 8px;
  padding: 16px;
  height: 250px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  max-width: 600px;
  word-break: break-word;
`;

const Text = styled.p`
  padding: 8px;
`;

function BiographySection({ bioDescription }) {
  return (
    <Wrapper>
      <Text className="roboto">{bioDescription}</Text>
    </Wrapper>
  );
}

BiographySection.propTypes = {
  bioDescription: PropTypes.string.isRequired,
};

export default BiographySection;
