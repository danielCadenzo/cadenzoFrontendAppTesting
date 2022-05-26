import loadable from 'utils/loadable';
import React, { memo, useCallback, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';
import * as NewAmenityIcons from 'constants/AmenityIcons';
import Modal from 'components/Modal';
import messages from './messages';

const Container = styled.div`
  width: 100% !important;
  display: flex;
  padding: 8px 0;
  display: flex;
  align-items: center;
`;

const Wrapper = styled.div`
  -webkit-box-pack: start !important;
  -webkit-box-align: stretch !important;
  display: flex !important;
  flex-direction: column;
  align-items: stretch !important;
  text-align: center;
  justify-content: flex-start !important;
  flex-wrap: wrap !important;
`;

function AmenitySection({ amenities = [] }) {
  const viewableAmenities = amenities.slice(0, Math.min(amenities.length, 4));
  const isShowMoreVisible = viewableAmenities.length < amenities.length;
  const [showModal, setShowModal] = useState(false);

  const toggleModal = useCallback(() => setShowModal(!showModal));
  return (
    <Wrapper className="d-flex full-width">
      {viewableAmenities.map(amenity => {
        const AmenityIcon = NewAmenityIcons[amenity];
        return (
          <Container>
            <AmenityIcon className="flex-shrink-0" />
            <p className="ml-2 text-bold f4">
              <FormattedMessage {...messages[amenity]} />
            </p>
          </Container>
        );
      })}
      {isShowMoreVisible && (
        <button
          onClick={toggleModal}
          type="button"
          aria-roledescription="show amenities"
        >
          <p className="h4 text-underline">View All</p>{' '}
        </button>
      )}

      <Modal isOpen={showModal} header="Venue Amenities" onClose={toggleModal}>
        <div className="d-flex py-4 flex-column">
          {amenities.map(amenity => {
            const AmenityIcon = NewAmenityIcons[amenity];
            return (
              <Container>
                <AmenityIcon className="flex-shrink-0" />
                <p className="ml-2 text-bold f4">
                  <FormattedMessage {...messages[amenity]} />
                </p>
              </Container>
            );
          })}
        </div>
      </Modal>
    </Wrapper>
  );
}

export default memo(AmenitySection);
