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
import { cadenzoPrimary } from 'utils/CssVariables';

import closeIcon from 'images/icons/white_close.svg';
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
  background-color: ${cadenzoPrimary};
  font-weight: 500;
  padding: 32px;
  color: white;
`;

const ModalWrapper = styled.div`
  z-index: 3;
  margin: 10% auto;
  background-color: white;
  max-width: ${props => (props.width ? `${props.width} !important` : '60%')};
  width: 100%;
  max-height: 80%;
  overflow: auto;
  border-radius: 8px;

  @media (max-width: 800px) {
    max-width: 95vw !important;
  }
`;

function Modal(props) {
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
    <ModalHeader className="d-flex flex-justify-between">
      <H2>{header}</H2>
      <img className="p-1" src={closeIcon} alt="close" onClick={closeModal} />
    </ModalHeader>
  );

  return (
    <BackDrop hidden={!isOpen} onClick={closeModal}>
      <ModalWrapper
        className={wrapperClassName}
        width={modalWidth}
        onClick={e => e.stopPropagation()}
        {...wrapperProps}
      >
        {renderHeader()}
        <div className="px-4">{children}</div>
      </ModalWrapper>
    </BackDrop>
  );
}

Modal.propTypes = {
  header: PropTypes.string,
  onClose: PropTypes.func.isRequired,
  children: PropTypes.arrayOf(PropTypes.node),
  isOpen: PropTypes.bool.isRequired,
  modalWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  wrapperClassName: PropTypes.string,
  wrapperProps: PropTypes.object,
};

Modal.defaultProps = {
  wrapperClassName: '',
  wrapperProps: {},
};

export default memo(Modal);
