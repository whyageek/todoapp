import React from 'react';
import ReactDOM from 'react-dom/client'; // Use the new client API for React 18+
import { ApolloProvider } from '@apollo/client';
import client from './services/ApolloClient';
import App from './App';

// Find the root element in your HTML
const rootElement = document.getElementById('root');

// Create a React root and render the app
const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </React.StrictMode>
);
