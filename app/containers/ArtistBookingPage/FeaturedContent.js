import React from 'react';
import Iframely from 'components/IFramely';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const Wrapper = styled.div`
  border-radius: 12px;
  border: 3px solid #5926cc;
  box-sizing: border-box;
  filter: drop-shadow(0px 6px 20px rgba(0, 0, 0, 0.1));
  border-radius: 20px;
  min-width: 300px;
  min-height: 300px;
  background-color: white;
`;

const Header = styled.div`
  background-color: #5926cc;
  padding: 12px;
  border-radius: 12px 12px 0 0;
  color: white;
`;

const ContentWrapper = styled.div`
  max-width: 200px;
`

function FeaturedContent(props) {
  const { featuredMedia } = props;

  return (
    <Wrapper>
      <Header>
        {' '}
        <p>
          <b>Featured Content</b>
        </p>{' '}
      </Header>
      <div className="p-2">
        {featuredMedia.map(link => (
          <ContentWrapper className="my-1 px-1">
            <Iframely url={link} />
          </ContentWrapper>
        ))}
        {featuredMedia.length === 0 && (
          <p>
            <b>No featured content yet!</b>
          </p>
        )}
      </div>
    </Wrapper>
  );
}

FeaturedContent.propTypes = {
  featuredMedia: PropTypes.array,
};

FeaturedContent.defaultProps = {
  featuredMedia: [],
};

export default FeaturedContent;
