import { all } from 'redux-saga/effects';
import Login from './login';

export default function* rootSaga() {
    yield all([
        Login()
    ]);
}