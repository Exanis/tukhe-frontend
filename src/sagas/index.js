import { all } from 'redux-saga/effects';
import Login from './login';
import Dashboard from './dashboard';
import Account from './account';

export default function* rootSaga() {
    yield all([
        Login(),
        Dashboard(),
        Account()
    ]);
}
