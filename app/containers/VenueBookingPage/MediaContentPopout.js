import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Button from 'components/Button';
import Modal from 'components/Modal';

const HeaderContainer = styled.div`
  max-width: 1128px;
  width: 100%;
  text-align: center;
  max-height: 300px;
  display: flex;
  position: relative;
  z-index: 2;
  align-items: end;
  justify-content: center;
  height: 100%;
`;

const MediaContentPopout = ({ images = [] }) => {
  const [showImageModal, setShowModal] = useState(false);

  const toggleModal = () => {
    setShowModal(!showImageModal);
  };

  return (
    <HeaderContainer>
      <Button
        disabled={!images.length}
        inverted={!images.length}
        onClick={toggleModal}
      >
        <p className="text-bold f3">View Photos</p>
      </Button>
      <Fragment>
        <Modal onClose={toggleModal} isOpen={showImageModal} modalWidth="70%">
          <div className="p-3 border">
            {images.map(src => (
              <img
                className="m-3"
                alt="venue"
                style={{ maxWidth: '100%' }}
                src={src}
              />
            ))}

            {images.length === 0 && (
              <p className="h4"> No additional images for this venue yet! </p>
            )}
          </div>
        </Modal>
      </Fragment>
    </HeaderContainer>
  );
};

MediaContentPopout.propTypes = {
  images: PropTypes.array,
};

export default MediaContentPopout;
