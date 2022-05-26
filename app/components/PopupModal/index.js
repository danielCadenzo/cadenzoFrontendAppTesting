/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/**
 *
 * Modal
 *
 */

import React, { memo } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import H2 from 'components/H2';

const BackDrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 15;
  height: 100%;
  background-color: #2a2a2ade;
`;

const ModalHeader = styled.div`
  font-weight: 500;
  color: black;

  button {
    font-weight: 300;
    position: absolute;
    background: transparent;
    border: 0px;
    color: black;
    font-size: 25px;

    cursor: pointer;
    top: 12px;
    right: 12px;
  }
`;

const ModalHeading = styled.div`
  //Top | horizonal | bottom
  padding: 56px 40px 0px;
`;

const ModalWrapper = styled.div`
  background: rgb(255, 255, 255);
  position: relative;
  margin: 0px;
  max-width: none;
  height: 100%;
  overflow-y: scroll;
  @media (min-width: 768px) {
    margin: 30px auto;
    max-width: 600px;
    overflow: initial;
    height: auto;
  }
`;

const ModalBody = styled.div`
  padding: 32px 40px 56px;
`;

function PopupModal(props) {
  const {
    onClose,
    children,
    header,
    isOpen,
    modalWidth,
    wrapperClassName,
    wrapperProps,
  } = props;
  const closeModal = () => onClose();

  const renderHeader = () => (
    <ModalHeader>
      <button
        data-testid="exitButton"
        type="button"
        alt="close"
        onClick={closeModal}
      >
        X
      </button>
      <ModalHeading>
        <H2 data-testid="header">{header}</H2>
      </ModalHeading>
    </ModalHeader>
  );

  return (
    <BackDrop data-testid="popupModal" hidden={!isOpen} onClick={closeModal}>
      <ModalWrapper
        className={wrapperClassName}
        width={modalWidth}
        onClick={e => e.stopPropagation()}
        {...wrapperProps}
      >
        {renderHeader()}
        <ModalBody>{children}</ModalBody>
      </ModalWrapper>
    </BackDrop>
  );
}

PopupModal.propTypes = {
  header: PropTypes.string,
  onClose: PropTypes.func.isRequired,
  children: PropTypes.arrayOf(PropTypes.node),
  isOpen: PropTypes.bool.isRequired,
  modalWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  wrapperClassName: PropTypes.string,
  wrapperProps: PropTypes.object,
};

PopupModal.defaultProps = {
  wrapperClassName: '',
  wrapperProps: {},
};

export default memo(PopupModal);
