/**
 * app.js
 *
 * This is the entry file for the application, only setup and boilerplate
 * code.
 */

// Needed for redux-saga es6 generator support
import '@babel/polyfill';

// Import all the third party stuff
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
} from '@apollo/client';
import history from 'utils/history';
import 'sanitize.css/sanitize.css';
import './sass/index.scss';
import { setContext } from '@apollo/client/link/context';
import { getCookie } from 'utils/localStorage';
import { BASE_URL } from 'data/api';
import { STRIPE_PUBLIC_KEY } from 'utils/stripe';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import 'utils/extensions';
// Import root app
import App from 'containers/App';
import GlobalInjector from 'containers/App/sagainjector';
import { ThemeProvider } from '@material-ui/core/styles';
import GlobalTheme from 'utils/GlobalTheme';
import { RelayEnvironmentProvider } from 'react-relay';
import LanguageProvider from 'containers/LanguageProvider';
import posthog from 'posthog-js';
import environment from './environment';
// Import Language Provider

// Load the favicon and the .htaccess file
/* eslint-disable import/no-unresolved, import/extensions */
import '!file-loader?name=[name].[ext]!./images/favicon.ico';
import 'file-loader?name=.htaccess!./.htaccess';
/* eslint-enable import/no-unresolved, import/extensions */

import configureStore from './configureStore';

// Import i18n messages
import { translationMessages } from './i18n';

// Create redux store with history
const initialState = {};
export const store = configureStore(initialState, history);
const MOUNT_NODE = document.getElementById('app');

export const clientURL = `${BASE_URL}/gql/`;

const httpLink = createHttpLink({
  uri: clientURL,
  credentials: 'same-origin',
});

// Stripe Config
const stripePromise = loadStripe(STRIPE_PUBLIC_KEY);

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = getCookie('authtoken');
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      'X-CSRFToken': token || '',
      Authorization: token,
    },
  };
});

// https://www.apollographql.com/docs/devtools/apollo-config/
const client = new ApolloClient({
  link: authLink.concat(httpLink),
  localSchemaFile: './../schema.graphql',
  cache: new InMemoryCache(),
});

// Register PostHog
if (!window.location.href.includes('127.0.0.1')) {
  posthog.init('phc_UtECzlYmif0nZaMcW6zwhnat47QK2n3V5B4vRgxPJCD', {
    api_host: 'https://app.posthog.com',
  });
}

const render = messages => {
  ReactDOM.render(
    <Provider store={store}>
      <ApolloProvider client={client}>
        <LanguageProvider messages={messages}>
          <ThemeProvider theme={GlobalTheme}>
            <RelayEnvironmentProvider environment={environment}>
              <ConnectedRouter history={history}>
                <Elements stripe={stripePromise}>
                  <GlobalInjector />
                  <App />
                </Elements>
              </ConnectedRouter>
            </RelayEnvironmentProvider>
          </ThemeProvider>
        </LanguageProvider>
      </ApolloProvider>
    </Provider>,
    MOUNT_NODE,
  );
};

if (module.hot) {
  // Hot reloadable React components and translation json files
  // modules.hot.accept does not accept dynamic dependencies,
  // have to be constants at compile-time
  module.hot.accept(['./i18n', 'containers/App'], () => {
    ReactDOM.unmountComponentAtNode(MOUNT_NODE);
    render(translationMessages);
  });
}

// Chunked polyfill for browsers without Intl support
if (!window.Intl) {
  new Promise(resolve => {
    resolve(import('intl'));
  })
    .then(() => Promise.all([import('intl/locale-data/jsonp/en.js')]))
    .then(() => render(translationMessages))
    .catch(err => {
      throw err;
    });
} else {
  render(translationMessages);
}

// Install ServiceWorker and AppCache in the end since
// it's not most important operation and if main code fails,
// we do not want it installed
if (process.env.NODE_ENV === 'production') {
  require('offline-plugin/runtime').install(); // eslint-disable-line global-require
}
