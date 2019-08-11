import React from 'react';
import ReactDOM from 'react-dom';
import App from './app';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import reduxPromise from 'redux-promise';
import {reducer} from './reducers';
import { composeWithDevTools } from 'redux-devtools-extension';
const store = createStore(reducer, composeWithDevTools(applyMiddleware(reduxPromise)));


ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.querySelector('main')
);
