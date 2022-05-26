import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Wrapper = styled.div`
  top: 0;
  width: 100%;
  display: flex;
  padding: 8px;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  background: #f6f8fa;
  padding: 16px 0;
  text-align: center;
  justify-content: center;
`;

const Header = styled.a`
  &:hover {
    text-decoration: underline !important;
  }
`;

function MessageSectionHeader({
  onViewRequest,
  hasActiveRequest,
  contactName,
  contactLink,
}) {
  return (
    <Wrapper>
      <Header href={contactLink} className="h1 color-primary">
        {' '}
        {contactName}{' '}
      </Header>
      {hasActiveRequest && (
        <Fragment>
          <div>
            <h1>Booking Request Pending</h1>
          </div>
          <btn onClick={onViewRequest}>
            <b className="color-primary">View</b>
          </btn>
        </Fragment>
      )}
    </Wrapper>
  );
}

MessageSectionHeader.propTypes = {
  onViewRequest: PropTypes.func,
  contactName: PropTypes.string.isRequired,
  hasActiveRequest: PropTypes.bool,
  contactLink: PropTypes.string,
};

export default MessageSectionHeader;
