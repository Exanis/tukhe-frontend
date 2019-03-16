import {takeLatest, put } from 'redux-saga/effects';

import {sessionLogin} from "../../../actions/login";
import user from "../../../reducers/user";

export default function* watcherSaga() {
    yield takeLatest(sessionLogin, sessionLoginSaga);
}

export function *sessionLoginSaga() {
    const token = localStorage.getItem('tukhe-token');

    if (token && token !== 'null')
        yield put(user.actions.setToken(token));
    else
        yield put(user.actions.setToken(null));
}
