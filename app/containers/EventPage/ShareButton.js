import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Modal from 'components/Modal';
import styled from 'styled-components';
import H4 from 'components/H4';
import QRCode from 'components/QrCode';
import Popover from '@material-ui/core/Popover';
import shareIcon from 'images/icons/share-2.svg';

const StyledLink = styled(H4)`
  color: #1d82a5;
`;

function ShareButton({ link = window.location.href, isEvent }) {
  const [showModal, updateShowModal] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const handleClose = () => {
    setAnchorEl(null);
  };

  const toggleModal = () => updateShowModal(!showModal);

  const handleCopyClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;
  const encodedLink = encodeURI(link);
  const twitterLink = `https://twitter.com/intent/tweet?source=tweetbutton&text=Check+This+Out+From+Cadenzo%21&url=${encodedLink}`;
  const facebookLink = `https://www.facebook.com/sharer.php?u=${encodedLink}&quote=Check+This+Out+From+Cadenzo%21`;
  return (
    <React.Fragment>
      <img
        style={{ zIndex: 2 }}
        onClick={toggleModal}
        src={shareIcon}
        width="24px"
      />
      <Modal
        wrapperClassName="p-1"
        modalWidth="80%"
        header="Share"
        isOpen={showModal}
        onClose={toggleModal}
      >
        <div className="d-flex flex-column full-width flex-items-center flex-justify-center">
          <StyledLink className="my-2 d-flex mt-4">
            <a href={facebookLink}>Facebook</a>
          </StyledLink>
          <hr />
          <StyledLink className="my-2 d-flex">
            <a href={twitterLink}>Twitter</a>
          </StyledLink>
          <hr />
          <div className="my-2 d-flex">
            <StyledLink>Copy Link:</StyledLink>
            <button type="button" onClick={handleCopyClick}>
              <code style={{ cursor: 'pointer !important' }}>{link}</code>
            </button>
            <Popover
              id={id}
              open={open}
              anchorEl={anchorEl}
              onClose={handleClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'center',
              }}
            >
              <div className="p-3 bg-blue">
                <h4 color="white">Copied!!!</h4>
              </div>
            </Popover>
          </div>
          <hr />
          <StyledLink className="my-2 d-flex">
            <a
              href={`mailto:yourfriend@example.com?subject = Check This Out&body = ${link}`}
            >
              Email
            </a>
          </StyledLink>
          <hr />
          <StyledLink className="my-2 d-flex">
            <a href={`sms://;?&body=${encodedLink}`}>SMS</a>
          </StyledLink>
          <hr />
          <StyledLink className="mb-1">QRCode for this link</StyledLink>
          <QRCode width={96} height={96} link={link} />
        </div>
      </Modal>
    </React.Fragment>
  );
}

ShareButton.propTypes = {
  link: PropTypes.string.isRequired,
};
export default ShareButton;
