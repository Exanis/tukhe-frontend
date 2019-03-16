import { all } from 'redux-saga/effects';
import Twitter from './Twitter';
import Session from './Session';

export default function* loginSaga() {
    yield all([
        Twitter(),
        Session()
    ]);
}
