import React, { useState } from 'react';
import './Checkout.scss';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import PropTypes from 'prop-types';
import Button from 'components/Button';
import styled from 'styled-components';
import { useForm } from 'react-form';
import { darkgrey } from 'utils/CssVariables';
import InputField from 'components/Form/InputField';
import * as axios from 'axios';
import { BASE_URL } from 'data/api';
import { PHONE_NUMBER_REGEX } from './constants';

const Label = styled.label`
  font-size: 18px;
  font-family: 'Work Sans', 'Franklin Gothic Medium', 'Arial Narrow', Arial,
    sans-serif !important;
  color: ${darkgrey};
`;

const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: '#32325d',
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      fontSmoothing: 'antialiased',
      fontSize: '16px',
      '::placeholder': {
        color: '#aab7c4',
      },
    },
    invalid: {
      color: '#fa755a',
      iconColor: '#fa755a',
    },
  },
};

const CardField = ({ onChange }) => (
  <div className="FormRow">
    <CardElement options={CARD_ELEMENT_OPTIONS} onChange={onChange} />
  </div>
);

const ErrorMessage = ({ children }) => (
  <div className="color-red" role="alert">
    <svg width="16" height="16" viewBox="0 0 17 17">
      <path
        fill="#FFF"
        d="M8.5,17 C3.80557963,17 0,13.1944204 0,8.5 C0,3.80557963 3.80557963,0 8.5,0 C13.1944204,0 17,3.80557963 17,8.5 C17,13.1944204 13.1944204,17 8.5,17 Z"
      />
      <path
        fill="#6772e5"
        d="M8.5,7.29791847 L6.12604076,4.92395924 C5.79409512,4.59201359 5.25590488,4.59201359 4.92395924,4.92395924 C4.59201359,5.25590488 4.59201359,5.79409512 4.92395924,6.12604076 L7.29791847,8.5 L4.92395924,10.8739592 C4.59201359,11.2059049 4.59201359,11.7440951 4.92395924,12.0760408 C5.25590488,12.4079864 5.79409512,12.4079864 6.12604076,12.0760408 L8.5,9.70208153 L10.8739592,12.0760408 C11.2059049,12.4079864 11.7440951,12.4079864 12.0760408,12.0760408 C12.4079864,11.7440951 12.4079864,11.2059049 12.0760408,10.8739592 L9.70208153,8.5 L12.0760408,6.12604076 C12.4079864,5.79409512 12.4079864,5.25590488 12.0760408,4.92395924 C11.7440951,4.59201359 11.2059049,4.59201359 10.8739592,4.92395924 L8.5,7.29791847 L8.5,7.29791847 Z"
      />
    </svg>
    {children}
  </div>
);

const CheckoutForm = props => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [cardComplete, setCardComplete] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState(null);

  const {
    isDirectCheckout,
    intentId,
    onUpdateCustomerName,
    isCartFree,
    onPaymentSuccessful,
  } = props;

  const {
    Form,
    values,
    meta: { isValid },
  } = useForm({
    validate: async newValues => {
      const { firstName, lastName, phone, email } = newValues;

      if (!phone || !PHONE_NUMBER_REGEX.test(phone)) {
        return 'Phone number invalid';
      }

      return !(firstName && lastName && phone && email);
    },
  });

  const processFreeCart = () => {
    const url = `${BASE_URL}/checkout`;
    return axios.get(url, {
      params: {
        orderId: intentId,
        email: values.email,
      },
    });
  };

  const handleDirectCheckoutSubmit = event => {
    event.preventDefault();
    const { firstName, lastName } = values;
    const customerName = `${firstName} ${lastName}`;
    if (isValid) {
      onUpdateCustomerName(customerName);
      if (isCartFree) {
        processFreeCart().then(() => onPaymentSuccessful());
      }
    }
  };

  const handleStripeSubmit = async event => {
    event.preventDefault();
    const { firstName, lastName, email, phone } = values;
    const customerName = `${firstName} ${lastName}`;

    if (!stripe || !elements) {
      // Stripe.js has not loaded yet. Make sure to disable
      // form submission until Stripe.js has loaded.
      return;
    }

    if (error) {
      elements.getElement('card').focus();
      return;
    }

    if (cardComplete) {
      setProcessing(true);
    }

    const result = await stripe.confirmCardPayment(props.intentId, {
      payment_method: {
        type: 'card',
        card: elements.getElement(CardElement),
        billing_details: {
          phone,
          name: customerName,
          email,
        },
      },
    });

    if (result.error) {
      // Show error to your customer (e.g., insufficient funds)
      console.error(result.error.message);
      setError(result.error);
      setProcessing(false);
    } else {
      // The payment has been processed!
      // eslint-disable-next-line no-lonely-if
      if (result.paymentIntent.status === 'succeeded') {
        setPaymentMethod(result.paymentIntent);
        props.onUpdateCustomerName(customerName);
        props.onPaymentSuccessful();
        // Show a success message to your customer
        // There's a risk of the customer closing the window before callback
        // execution. Set up a webhook or plugin to listen for the
        // payment_intent.succeeded event that handles any business critical
        // post-payment actions.
      }
    }
  };

  const onSubmit = isDirectCheckout
    ? handleDirectCheckoutSubmit
    : handleStripeSubmit;

  return (
    <Form
      className="d-flex flex-column ml-3 flex-items-center"
      onSubmit={onSubmit}
    >
      <h3 className="f3 my-2"> Enter Payment Information </h3>
      <fieldset
        className="d-flex flex-column mb-3"
        style={{ width: '60%', maxWidth: '900px' }}
      >
        <div className="d-flex flex-wrap flex-justify-around">
          <InputWrapper className="mr-3">
            <Label> First Name </Label>
            <InputField
              label="Name"
              id="firstName"
              type="text"
              placeholder="Jane"
              required
              autoComplete="given-name"
              name="firstName"
            />
          </InputWrapper>

          <InputWrapper>
            <Label> Last Name </Label>
            <InputField
              label="Name"
              id="lastName"
              type="text"
              placeholder="Doe"
              required
              autoComplete="family-name"
              name="lastName"
            />
          </InputWrapper>
        </div>

        <InputWrapper className="my-2">
          <Label> Email </Label>
          <InputField
            label="Email"
            id="email"
            type="email"
            placeholder="janedoe@gmail.com"
            required
            autoComplete="email"
            name="email"
          />
        </InputWrapper>

        <InputWrapper>
          <Label> Phone </Label>
          <InputField
            label="Phone"
            id="phone"
            type="tel"
            placeholder="(941) 555-0123"
            required
            autoComplete="tel"
            name="phone"
          />
        </InputWrapper>
      </fieldset>
      {!isDirectCheckout && (
        <fieldset className="FormGroup full-width">
          <CardField
            onChange={e => {
              setError(e.error);
              setCardComplete(e.complete);
            }}
          />
        </fieldset>
      )}
      {false && <ErrorMessage>{error.message}</ErrorMessage>}
      <Button
        type="submit"
        processing={processing}
        error={error}
        disabled={!isDirectCheckout && (processing || !stripe)}
      >
        Pay Now
      </Button>
    </Form>
  );
};

CheckoutForm.propTypes = {
  intentId: PropTypes.string.isRequired,
  isDirectCheckout: PropTypes.bool.isRequired,
  isCartFree: PropTypes.bool.isRequired,
  onPaymentSuccessful: PropTypes.func.isRequired,
  onUpdateCustomerName: PropTypes.func.isRequired,
};

export default CheckoutForm;
