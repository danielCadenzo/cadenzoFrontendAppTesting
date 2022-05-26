import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { dateTimeToHumanReadable } from 'utils/helpers';
import ShareButton from 'containers/EventPage/ShareButton';

import heartIcon from 'images/icons/heart.svg';
import filledHeartIcon from 'images/icons/filled-heart.svg';

const ItemContainer = styled.div`
  display: flex;
  margin-bottom: -24px;
  padding: 0 16px;
  justify-content: flex-end;
`;

const Image = styled.img`
  width: 24px;
  height: 24px;
  z-index: 1;
`;

const ImageWrapper = styled.div`
  padding: 8px;
  border-radius: 100%;
  border-color: #4b4d63;
  border: 1px solid;
  margin: 0 8px;
  background-color: white;
`;

function EventCard(props) {
  const Background = styled.div`
    background-image: url("${props.image}");
    background-repeat: no-repeat;
    background-size: cover;
    width: 360px;
    height: 184px;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    @media (max-width: 450px) {
      width: 100%;
      height: inherit;
      min-height: 200px;
    }
  `;

  const Wrapper = styled.div`
    @media (max-width: 450px) {
      width: 100%;
      height: inherit;
    }
  `;

  const [isFavorited, updateIsFavorited] = useState(props.isFavorited);
  // TODO: Fix
  const isFavoritedIcon = isFavorited ? filledHeartIcon : heartIcon;

  const onFavoriteHandler = evnt => {
    evnt.stopPropagation();
    evnt.preventDefault();
    const { id, onFavorite } = props;
    onFavorite(id, isFavorited, updateIsFavorited);
  };

  const onClickHandler = () => {
    const { onClick, event } = props;
    onClick(event);
  };

  const handleShareEvent = evnt => {
    evnt.stopPropagation();
    evnt.preventDefault();
  };

  const getEventLink = () => {
    const { id } = props;
    return `${window.location.origin}/event/${id}`;
  };

  return (
    <Wrapper className="d-flex flex-column m-3 cursor-pointer">
      <Background onClick={onClickHandler}>
        <ItemContainer>
          <ImageWrapper>
            <Image onClick={onFavoriteHandler} src={isFavoritedIcon} />{' '}
          </ImageWrapper>
          <ImageWrapper onClick={handleShareEvent}>
            <ShareButton link={getEventLink()} />
          </ImageWrapper>
        </ItemContainer>
      </Background>
      <div className="px-2">
        <h3 className="mt-4 f4 color-primary">
          {dateTimeToHumanReadable(props.date)}
        </h3>
        <h2>{props.title}</h2>
      </div>
    </Wrapper>
  );
}

EventCard.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  event: PropTypes.object.isRequired,
  image: PropTypes.string.isRequired,
  onFavorite: PropTypes.func.isRequired,
  isFavorited: PropTypes.bool,
  onShare: PropTypes.func,
  onClick: PropTypes.func.isRequired,
  date: PropTypes.string,
};

EventCard.defaultProps = {
  isFavorited: false,
};

export default EventCard;
