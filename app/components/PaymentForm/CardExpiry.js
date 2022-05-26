import React, { Component } from 'react';

import NumberFormat from 'react-number-format';

function limit(val, max) {
  if (val.length === 1 && val[0] > max[0]) {
    val = `0${val}`;
  }

  if (val.length === 2) {
    if (Number(val) === 0) {
      val = '01';

      // this can happen when user paste number
    } else if (val > max) {
      val = max;
    }
  }

  return val;
}

function cardExpiry(val) {
  const month = limit(val.substring(0, 2), '12');
  const year = val.substring(2, 4);

  return month + (year.length ? `/${year}` : '');
}

export default function CardExpiry(props) {
  const { component: Component, inputRef, ...other } = props;

  // implement `InputElement` interface
  React.useImperativeHandle(inputRef, () => ({
    focus: () => {
      // logic to focus the rendered component from 3rd party belongs here
    },
    // hiding the value e.g. react-stripe-elements
  }));

  // `Component` will be your `SomeThirdPartyComponent` from below
  return <NumberFormat format={cardExpiry} {...other} />;
}
