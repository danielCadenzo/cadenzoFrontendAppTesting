import React, { useCallback, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import Button from 'components/Button';
import DateTimeField from 'components/Form/DateTimeField';
import { isBeforeToday } from 'utils/dates';
import { DateTime } from 'luxon';
import { OVERRIDE_CALENDAR_FIELD } from '../constants';
import OverrideTimeRange from './OverrideTimeRange';
import { generateTimeRange } from './utils';
import OverrideModal from './OverrideModal';

const SpecificDateButton = ({ onTogglePortal }) => (
  <Button onClick={onTogglePortal}>Add specific dates</Button>
);

SpecificDateButton.propTypes = {
  onTogglePortal: PropTypes.func,
};

function OverrideContainer({
  onSubmitDateOverrides,
  modalDaySelection,
  commitOverrides,
  profileIsArtist,
  selectedDateOverrides,
  profileDefaultLocation,
}) {
  const [showModal, setShowModal] = useState(false);

  const handleOverrideModalToggle = () => {
    setShowModal(!showModal);
  };

  const onSubmitNewOverrides = newOverrides => {
    onSubmitDateOverrides([...selectedDateOverrides, ...newOverrides]);
  };

  return (
    <div className="p-2">
      <Button onClick={handleOverrideModalToggle}> Add override </Button>
      {showModal && (
        <OverrideModal
          onClose={handleOverrideModalToggle}
          isOpen={showModal}
          onSubmit={onSubmitNewOverrides}
          profileIsArtist={profileIsArtist}
          profileDefaultLocation={profileDefaultLocation}
        />
      )}
    </div>
  );
}

OverrideContainer.propTypes = {
  children: PropTypes.any,
  setFieldValue: PropTypes.func.isRequired,
  formValues: PropTypes.object,
  onSubmitDateOverride: PropTypes.func,
  handleDateSelect: PropTypes.func,
  modalDaySelection: PropTypes.array,
};

export default OverrideContainer;
