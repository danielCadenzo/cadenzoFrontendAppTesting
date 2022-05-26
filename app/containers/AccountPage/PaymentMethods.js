/* eslint-disable no-console */
import React, { Component } from 'react';
import styled from 'styled-components';
import { Button } from '@material-ui/core';
import PaymentForm from 'components/PaymentForm';
import { createGQLQuery } from 'data/api';
import CardListItem from './CardListItem';
import {
  FETCH_PAYMENT_METHODS,
  ADD_PAYMENT_METHOD,
  REMOVE_PAYMENT_METHOD,
} from './queries';

const TEST_CARD_ARRAY = JSON.parse(
  '[{"id": "card_1HfItQIn42NEPbAYODDlBi6m", "object": "payment_method", "billing_details": {"address": {"city": null, "country": "US", "line1": null, "line2": null, "postal_code": null, "state": null}, "email": null, "name": null, "phone": null}, "card": {"brand": "visa", "checks": {"address_line1_check": null, "address_postal_code_check": null, "cvc_check": "pass"}, "country": "US", "exp_month": 4, "exp_year": 2024, "fingerprint": "HnHbib6SDvpLYmcR", "funding": "credit", "generated_from": null, "last4": "4242", "networks": {"available": ["visa"], "preferred": null}, "three_d_secure_usage": {"supported": true}, "wallet": null}, "created": 1603431168, "customer": "cus_IFoWfujNI0bhEx", "livemode": false, "metadata": {}, "type": "card"}]',
);

// TODO: Unhide Payout Methods
class PaymentMethods extends Component {
  constructor(props) {
    super(props);

    this.state = {
      paymentMethods: [],
    };
  }

  componentDidMount() {
    this.fetchPaymentMethods();
  }

  fetchPaymentMethods() {
    createGQLQuery(FETCH_PAYMENT_METHODS).then(data => {
      const { viewer } = data;
      if (viewer && viewer.paymentMethods) {
        this.setState({ paymentMethods: JSON.parse(viewer.paymentMethods) });
      }
    });
  }

  renderPaymentMethods = () =>
    this.state.paymentMethods.map(node => {
      const { card } = node;
      const { exp_month: expMonth, exp_year: expYear } = card;
      const expiration = expMonth < 10 ? `0${expMonth}` : expMonth;
      return (
        <CardListItem
          cardType={card.brand}
          last4={card.last4}
          expirationDate={`${expiration}/${expYear}`}
          paymentId={node.id}
          onRemove={this.onRemovePaymentMethod}
        />
      );
    });

  onAddPaymentMethod = (cardInfo, callback) => {
    const { cardNumber, zipCode, cvc, expiry } = cardInfo;
    console.log(cardInfo);
    createGQLQuery(ADD_PAYMENT_METHOD, {
      cardNumber,
      cvc,
      expiry,
      zipCode,
    }).then(data => {
      const { addPaymentMethod } = data;
      if (addPaymentMethod) {
        this.fetchPaymentMethods();
      }
    });
  };

  onRemovePaymentMethod = pmId => {
    createGQLQuery(REMOVE_PAYMENT_METHOD, { pmId }).then(data => {
      const { removePaymentMethod } = data;
      if (removePaymentMethod && removePaymentMethod.success) {
        this.fetchPaymentMethods();
      }
    });
  };

  render() {
    return (
      <div className="container-sm full-height mt-4 d-flex flex-column">
        <PaymentForm onCardSubmit={this.onAddPaymentMethod} />

        {this.renderPaymentMethods()}
      </div>
    );
  }
}

export default PaymentMethods;
