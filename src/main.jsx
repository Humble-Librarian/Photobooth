// main.jsx
// Entry point: renders the app inside the root element with layout.

import React from 'react';
import ReactDOM from 'react-dom/client';
import Layout from './app/layout.jsx';
import App from './app/page.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <Layout>
    <App />
  </Layout>
); 