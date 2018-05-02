import React from 'react';
import ReactDOM from 'react-dom';
import { ApolloProvider } from 'react-apollo';
import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { split } from 'apollo-boost';
import { WebSocketLink } from 'apollo-link-ws';
import { getMainDefinition } from 'apollo-utilities';

import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

const { REACT_APP_SUBSCRIPTIONS_API, REACT_APP_SIMPLE_API } = process.env;

const wsLink = new WebSocketLink({
  uri: REACT_APP_SUBSCRIPTIONS_API,
  options: {
    reconnect: true
  }
});

const httpLink = new HttpLink({ uri: REACT_APP_SIMPLE_API });

const link = split(
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query);

    return kind === 'OperationDefinition' && operation === 'subscription';
  },
  wsLink,
  httpLink
);

const client = new ApolloClient({
  link,
  cache: new InMemoryCache()
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById('root')
);
registerServiceWorker();
