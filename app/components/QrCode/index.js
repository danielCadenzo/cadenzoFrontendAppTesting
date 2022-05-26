/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable react/no-danger */
/**
 *
 * QrCode
 *
 */

import React, { memo, useState } from 'react';
import PropTypes from 'prop-types';

import qrcodegen from 'utils/qrcodegen.min';
import Modal from 'components/Modal';
function QrCode({ link, width, height }) {
  const QRC = qrcodegen.QrCode;
  const qr0 = QRC.encodeText(link, QRC.Ecc.HIGH);
  const svg = qr0.toSvgString(1);
  const [showEnlarged, setShowEnlarged] = useState(false);

  const actionHandler = () => setShowEnlarged(!showEnlarged);

  return (
    <React.Fragment>
      <div
        role="img"
        tabIndex="-1"
        onKeyPress={actionHandler}
        onClick={actionHandler}
        style={{ minWidth: width, minHeight: height, height, width }}
        dangerouslySetInnerHTML={{ __html: svg }}
      />
      <Modal onClose={actionHandler} isOpen={showEnlarged} header="QR Code">
        <div
          role="img"
          tabIndex="-1"
          onKeyPress={actionHandler}
          onClick={actionHandler}
          className="d-flex mx-auto p-3"
          style={{
            minWidth: width,
            minHeight: height,
            maxHeight: 400,
            maxWidth: 400,
          }}
          dangerouslySetInnerHTML={{ __html: svg }}
        />
      </Modal>
    </React.Fragment>
  );
}

QrCode.propTypes = {
  link: PropTypes.string.isRequired,
  width: PropTypes.oneOf([PropTypes.string, PropTypes.number]),
  height: PropTypes.oneOf([PropTypes.string, PropTypes.number]),
};

QrCode.defaultProps = {
  width: 96,
  height: 96,
};

export default memo(QrCode);
