import { configureStore } from "redux-starter-kit";
import createSagaMiddleware from 'redux-saga';
import logger from 'redux-logger';
import { intlReducer } from 'react-intl-redux';
import sagas from '../sagas';

import User from './user';

const sagaMiddleware = createSagaMiddleware();
const reducer = {
    user: User.reducer,
    intl: intlReducer
};
const middleware = [
    sagaMiddleware
];
const baseState = {

};

if (process.env.NODE_ENV !== 'production')
    middleware.push(logger);

export default configureStore({
    reducer,
    middleware,
    devTools: process.env.NODE_ENV !== 'production',
    baseState
});

sagaMiddleware.run(sagas);