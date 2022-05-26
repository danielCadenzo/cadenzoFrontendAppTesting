import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { NavLink } from 'react-router-dom';

class SideNavItem extends PureComponent {
  render() {
    const { linkTo } = this.props;

    const Wrapper = styled.div`
      background-color: 'inherit';
      color: black;
      font-weight: 700;

      .active > & {
        background-color: #f4f4f4 !important;
        border-right: 3px solid #1d82a5 !important;
      }
    `;
    return (
      <NavLink
        to={linkTo}
        exact
        activeStyle={{
          backgroundColor: '#F4F4F4 !important',
          borderRight: '3px solid blue !important',
          color: 'black',
          textDecoration: 'none',
        }}
      >
        <Wrapper className="p-3">{this.props.label}</Wrapper>
      </NavLink>
    );
  }
}

SideNavItem.defaultProps = {
  isActive: false,
};

SideNavItem.propTypes = {
  label: PropTypes.string.isRequired,
  linkTo: PropTypes.string.isRequired,
  isActive: PropTypes.bool,
};

export default SideNavItem;
