import React from 'react';
import styled from 'styled-components';
import Routes from '../../data/Routes';
import SideNavItem from './SideNavItem';

const Wrapper = styled.div`
  min-width: 150px;
`;

function SideNav() {
  const pageLinks = [
    Routes.homeDashboard(),
    Routes.patronDashboard(),
    Routes.financialDashboard(),
    Routes.designManager(),
  ];
  const pageLabels = ['Dashboard', 'My Patrons', 'Financials', 'Venue Design'];

  return (
    <Wrapper className="shadow d-flex flex-column full-height fit-content-width">
      {pageLabels.map((label, i) => (
        <SideNavItem
          key={label}
          label={label}
          linkTo={pageLinks[i]}
          isActive={pageLinks[i] === window.location.pathname}
        />
      ))}
    </Wrapper>
  );
}

export default SideNav;
