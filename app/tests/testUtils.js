// test-utils.js
import React from 'react';
import { render as rtlRender } from 'react-testing-library';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
// Import your own reducer
import reducer from '../reducers';

export const noopFactory = () => {};

function render(
  ui,
  {
    initialState,
    store = createStore(reducer(), initialState),
    ...renderOptions
  } = {},
) {
  // eslint-disable-next-line react/prop-types
  function Wrapper({ children }) {
    return <Provider store={store}>{children}</Provider>;
  }
  return rtlRender(ui, { wrapper: Wrapper, ...renderOptions });
}

// re-export everything
export * from 'react-testing-library';
// override render method
export { render };
