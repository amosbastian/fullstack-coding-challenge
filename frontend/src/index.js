import axios from 'axios';
import React from 'react';
import ReactDOM from 'react-dom';
import './assets/styles/tailwind.css';
import Application from './components/application/Application';
import * as serviceWorker from './serviceWorker';

axios.defaults.baseURL = process.env.REACT_APP_FLASK_URL;
axios.defaults.headers.post['Content-Type'] = 'application/json';

ReactDOM.render(<Application />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();