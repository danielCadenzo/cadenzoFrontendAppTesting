import React, { Component } from 'react';
import PaymentForm from 'components/PaymentForm';

class CardForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cardNumber: '',
      expiry: '',
      zipCode: '',
      cvc: '',
    };
  }

  testZipCode = value => {
    const re = /^\d{5}(?:[-\s]\d{4})?$/;
    return re.test(value);
  };

  render() {
    return <PaymentForm />;
  }
}

export default CardForm;
