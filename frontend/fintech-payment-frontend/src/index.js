// src/index.js
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import axios from 'axios';

// Set default authorization header if user is logged in
const user = JSON.parse(localStorage.getItem('user'));
if (user && user.token) {
  axios.defaults.headers.common['Authorization'] = 'Bearer ' + user.token;
}

ReactDOM.render(<App />, document.getElementById('root'));
