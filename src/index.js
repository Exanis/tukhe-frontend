import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

import {Provider} from 'react-intl-redux';
import store from './reducers';

import { BrowserRouter } from "react-router-dom";
import axios from 'axios';

import App from './pages';

axios.defaults.withCredentials = true;

ReactDOM.render(<Provider store={store}>
    <BrowserRouter>
        <App />
    </BrowserRouter>
</Provider>, document.getElementById('root'));
