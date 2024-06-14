import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { UserProvider } from './utils/UserContext';
import App from './App';
ReactDOM.render(
  <Router>
    <UserProvider>
    <App />
    </UserProvider>
  </Router>,
  document.getElementById('root')
);
