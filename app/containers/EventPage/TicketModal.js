/* eslint-disable consistent-return */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Modal from 'components/Modal';
import TicketSelectionScreen from './TicketSelection';
import CheckoutForm from './CheckoutForm';
import CheckoutConfirmation from './CheckoutConfirmation';

const CHECKOUT_SCREENS = Object.freeze({
  TICKET_SELECTION: 'TICKET_SELECTION',
  CUSTOMER_CHECKOUT: 'CUSTOMER_CHECKOUT',
  CONFIRMATION: 'CONFIRMATION',
});

function TicketPurchaseModal(props) {
  const { event, gaTicketOptions } = props;

  const [paymentIntent, updatePaymentIntent] = useState(null);
  const [checkoutTotal, setCheckoutTotal] = useState(0);
  const [showDirectCheckout, onShowDirectCheckout] = useState(false);
  const [isCartFree, setIsCartFree] = useState(false);
  const [selectedSeats, updateSelectedSeats] = useState({});
  const [purchaserName, setPurchaserName] = useState('');
  const [activeCheckoutStep, setActiveCheckoutStep] = useState(
    CHECKOUT_SCREENS.TICKET_SELECTION,
  );

  const [eventCart, updateEventCart] = useState({});

  const onUpdateAmountInCart = (ticketGrp, evnt) => {
    if (!ticketGrp) return null;
    const {
      target: { value },
    } = evnt;
    const { id } = ticketGrp;
    updateEventCart({ ...eventCart, [id]: value });
  };

  const handlePaymentClose = () => {
    setActiveCheckoutStep(CHECKOUT_SCREENS.CONFIRMATION);
  };

  const handleConfirmationClose = () => {
    const { onClose } = props;
    onClose();
    // eslint-disable-next-line no-restricted-globals
    location.reload();
  };

  const onPaymentIntentCreated = id => {
    updatePaymentIntent(id);
    setActiveCheckoutStep(CHECKOUT_SCREENS.CUSTOMER_CHECKOUT);
  };

  const renderCorrectScreen = () => {
    const isDirectCheckout = checkoutTotal === 0;
    switch (activeCheckoutStep) {
      case CHECKOUT_SCREENS.TICKET_SELECTION: {
        return (
          <TicketSelectionScreen
            onIntentCreated={onPaymentIntentCreated}
            event={event}
            cart={eventCart}
            gaTicketOptions={gaTicketOptions}
            onUpdateCart={onUpdateAmountInCart}
            showDirectCheckout={showDirectCheckout}
            onShowDirectCheckout={onShowDirectCheckout}
            updateSelectedSeats={updateSelectedSeats}
            selectedSeats={selectedSeats}
            updateCheckoutTotal={setCheckoutTotal}
            updateIsCartFree={setIsCartFree}
          />
        );
      }
      case CHECKOUT_SCREENS.CUSTOMER_CHECKOUT: {
        return (
          <CheckoutForm
            onPaymentSuccessful={handlePaymentClose}
            intentId={paymentIntent}
            onUpdateCustomerName={setPurchaserName}
            purchaserName={purchaserName}
            isCartFree={isCartFree}
            isDirectCheckout={isDirectCheckout && isCartFree}
          />
        );
      }
      case CHECKOUT_SCREENS.CONFIRMATION: {
        return (
          <CheckoutConfirmation
            onClose={handleConfirmationClose}
            eventTitle={event.title}
            customerName={purchaserName}
          />
        );
      }
      default:
        return (
          <TicketSelectionScreen
            onIntentCreated={onPaymentIntentCreated}
            event={event}
            cart={eventCart}
            gaTicketOptions={gaTicketOptions}
            onUpdateCart={onUpdateAmountInCart}
            showDirectCheckout={showDirectCheckout}
            onShowDirectCheckout={onShowDirectCheckout}
            updateSelectedSeats={updateSelectedSeats}
            selectedSeats={selectedSeats}
          />
        );
    }
  };

  const modalStyle =
    activeCheckoutStep === CHECKOUT_SCREENS.TICKET_SELECTION
      ? {}
      : { style: { backgroundColor: '#e4e4e4' } };

  return (
    <Modal
      wrapperClassName="p-1"
      wrapperProps={modalStyle}
      modalWidth="80%"
      header="Buy Tickets"
      isOpen={props.isOpen}
      onClose={props.onClose}
    >
      {renderCorrectScreen()}
    </Modal>
  );
}

TicketPurchaseModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  event: PropTypes.object.isRequired,
  gaTicketOptions: PropTypes.array.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default TicketPurchaseModal;
