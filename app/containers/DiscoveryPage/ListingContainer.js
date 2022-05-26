'use es6';

import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import Button from 'components/Button';
import { useWindowDimensions } from 'utils/customHooks';
import styled from 'styled-components';
import messages from './messages';
import MobileDrawer from '../../components/MobileDrawer';
import { PRIMARY_SEARCH_TYPES } from './constants';

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
`;

export function DrawerContainer({
  searchType,
  onNextPage,
  onPrevPage,
  ListComponent,
  hasNextPage,
  hasPreviousPage,
  DrawerHeader,
  listings,
}) {
  const { width } = useWindowDimensions();
  if (width < 600)
    return (
      <MobileDrawer alwaysShowPartial drawerContent={<DrawerHeader />}>
        {listings &&
          listings.map(nodeItem => (
            <ListComponent
              key={nodeItem.node.id}
              venue={{ ...nodeItem.node }}
              artist={{ ...nodeItem.node }}
            />
          ))}
        <ButtonContainer>
          <Button
            className="px-4 py-3"
            onClick={onPrevPage}
            inverted={!hasPreviousPage}
            disabled={!hasPreviousPage}
          >
            <FormattedMessage {...messages.previous} />
          </Button>

          <Button
            className="px-5 py-3"
            onClick={onNextPage}
            inverted={!hasNextPage}
            disabled={!hasNextPage}
          >
            <FormattedMessage {...messages.next} />
          </Button>
        </ButtonContainer>
      </MobileDrawer>
    );
  return (
    <div
      className={
        searchType === PRIMARY_SEARCH_TYPES.ARTIST
          ? 'd-flex flex-wrap flex-justify-around'
          : 'd-flex flex-column full-width flex-wrap flex-justify-around'
      }
    >
      <>
        {listings &&
          listings.map(nodeItem => (
            <ListComponent
              venue={{ ...nodeItem.node }}
              artist={{ ...nodeItem.node }}
            />
          ))}
      </>
    </div>
  );
}

DrawerContainer.propTypes = {
  searchType: PropTypes.string,
  ListComponent: PropTypes.func.isRequired,
  DrawerHeader: PropTypes.oneOfType([PropTypes.node, PropTypes.func])
    .isRequired,
  listings: PropTypes.array,
  hasPreviousPage: PropTypes.bool.isRequired,
  hasNextPage: PropTypes.bool.isRequired,
  onPrevPage: PropTypes.func.isRequired,
  onNextPage: PropTypes.func.isRequired,
};

export default DrawerContainer;
