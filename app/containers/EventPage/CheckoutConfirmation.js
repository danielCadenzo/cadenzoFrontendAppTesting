import React from 'react';
import PropTypes from 'prop-types';
import Button from 'components/Button';
import H2 from 'components/H2';
import H4 from 'components/H4';
import { FormattedMessage } from 'react-intl';
import messages from './messages';
function CheckoutConfirmation({ onClose, customerName, eventTitle }) {
  return (
    <div className="d-flex flex-column p-4 flex-items-center">
      <H2 className="my-3"> Confirmation </H2>
      <H4> Hey {customerName}, </H4>
      <p className="my-3">
        <FormattedMessage
          {...messages.checkoutConfirmation}
          values={{
            eventTitle,
          }}
        />
      </p>
      <Button onClick={onClose}> Close </Button>
    </div>
  );
}

CheckoutConfirmation.propTypes = {
  onClose: PropTypes.func.isRequired,
  customerName: PropTypes.string.isRequired,
  eventTitle: PropTypes.string.isRequired,
};

export default CheckoutConfirmation;
