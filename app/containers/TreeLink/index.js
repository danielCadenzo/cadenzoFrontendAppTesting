/**
 *
 * TreeLink
 *
 */

import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { compose } from 'redux';
import styled from 'styled-components';
import InstagramIcon from '@material-ui/icons/Instagram';
import TwitterIcon from '@material-ui/icons/Twitter';

const WEBSITE_LINKS = [
  {
    link: 'https://www.cadenzotickets.co/event/RXZlbnROb2RlOjI=',
    text: 'FC Tulsa vs North Texas SC',
  },
  {
    link: 'https://www.cadenzotickets.co/event/RXZlbnROb2RlOjM=',
    text: 'FC Tulsa vs Austin Bold FC',
  },
  { link: 'https://shop.fctulsa.com/', text: 'Shop' },
  { link: 'https://www.fctulsa.com/2021-schedule', text: 'Schedule' },
];

const SOCIAL_MEDIA = [
  {
    icon: <InstagramIcon fontSize="large" color="white" />,
    link: 'https://instagram.com/fctulsa?igshid=1tnjvquac3feg',
  },
  {
    icon: <TwitterIcon fontSize="large" />,
    link: 'https://twitter.com/FCTulsa?s=20',
  },
];

const HeaderImage = styled.img``;

const Container = styled.div`
  background-image: linear-gradient(
    155deg,
    rgb(11, 175, 255),
    rgb(57, 224, 155) 50%,
    rgb(255, 194, 19)
  );
  overflow: hidden;
  box-shadow: rgb(0 0 0 / 8%) 0px 96px 96px 0px;
`;

const ButtonLink = styled.a`
  width: 100%;
  background: white;
  color: black;
  display: flex;
  justify-content: center;
  border-radius: 16px;
  max-width: 600px;
`;

const renderSocialIcons = Icon => (
  <btn>
    <Icon />
  </btn>
);
export function TreeLink() {
  return (
    <Container className="full-width full-height d-flex flex-column">
      <Helmet>
        <title>TreeLink</title>
        <meta name="description" content="Description of TreeLink" />
      </Helmet>
      <div className="d-flex flex-column my-4 px-2 flex-justify-center flex-items-center full-width">
        <img
          height={96}
          width={96}
          className="rounded-1 mb-5"
          src="https://cdn1.sportngin.com/attachments/logo_graphic/fa09-138244076/FC_Tulsa_Primary_Crest_HEX_small.png"
        />
        {WEBSITE_LINKS.map(link => (
          <div
            style={{ maxWidth: 600 }}
            className="my-2 full-width flex-self-center d-flex flex-self-center"
          >
            <ButtonLink
              className="work-sans-black full-width h3 py-3 d-flex flex-self-center text-center"
              href={link.link}
            >
              {link.text}
            </ButtonLink>
          </div>
        ))}
        <div className="d-flex flex-justify-center mt-2">
          {SOCIAL_MEDIA.map(social => (
            <a className="mx-2" href={social.link}>
              {social.icon}
            </a>
          ))}
        </div>
      </div>
    </Container>
  );
}

TreeLink.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

const withConnect = connect(
  null,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  memo,
)(TreeLink);
