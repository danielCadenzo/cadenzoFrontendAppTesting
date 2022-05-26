/**
 *
 * UiAvatar
 *
 */

import React, { memo, useState } from 'react';
import PropTypes from 'prop-types';
import Checkbox from 'components/Form/Checkbox';
import Modal from 'components/Modal';
import FilterListIcon from '@material-ui/icons/FilterList';
import Button from 'components/Button';
import PerformanceTypes from 'constants/PerformanceTypes';
import { GENRE_OPTIONS } from './constants';
function VenueFiltersModal({ onSearchChange, values }) {
  const [showModal, setShowModal] = useState(false);

  const toggleModal = () => setShowModal(!showModal);

  return (
    <div>
      <Button onClick={toggleModal}>
        {' '}
        <FilterListIcon htmlColor="white" /> Filters{' '}
      </Button>
      <Modal
        header="Filters"
        modalWidth="80%"
        isOpen={showModal}
        onClose={toggleModal}
      >
        <div className="d-flex flex-column py-5">
          <h3 className="h3 mt-3"> Genres/Vibes </h3>
          <div className="p-2 d-flex flex-wrap mb-3 full-width">
            {GENRE_OPTIONS.map(genre => (
              <Checkbox
                style={{ width: '45%' }}
                isArray
                field="genres"
                className="mr-1"
                value={genre.value}
                type="checkbox"
                label={genre.label}
              />
            ))}
          </div>

          <h3 className="h3"> Performance Types </h3>
          <div className="d-flex flex-wrap my-2 full-width">
            {Object.keys(PerformanceTypes).map(performanceType => (
              <Checkbox
                isArray
                style={{ width: '45%' }}
                field="amenities"
                className="mr-1"
                value={performanceType}
                type="checkbox"
                label={PerformanceTypes[performanceType]}
              />
            ))}
          </div>
          <div className="d-flex full-width flex-justify-end">
            <Button onClick={toggleModal}> Submit </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

VenueFiltersModal.propTypes = {
  onSearchChange: PropTypes.func.isRequired,
};

export default memo(VenueFiltersModal);
