import { all } from 'redux-saga/effects';
import Twitter from './Twitter';

export default function* loginSaga() {
    yield all([
        Twitter()
    ]);
}