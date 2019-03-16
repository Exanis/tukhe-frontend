import {takeLatest, call, put} from 'redux-saga/effects';
import axios from 'axios';

import {api} from '../../services/path';
import account from '../../reducers/account';
import user from '../../reducers/user';
import twitterLoginSaga from './Twitter';

import {loadAccounts, deleteAccount, createTwitterAccount} from '../../actions/account';

export default function* watcherSaga() {
    yield takeLatest(loadAccounts, loadAccountSaga);
    yield takeLatest(deleteAccount, deleteAccountSaga);
    yield takeLatest(createTwitterAccount, twitterLoginSaga);
}

export function fetchAccountsList() {
    return axios.get(api('/api/v1/account/'));
}

export function *loadAccountSaga() {
    try {
        const result = yield call(fetchAccountsList);

        yield put(account.actions.setAccounts(result.data));
    } catch(error) {
        yield put(user.actions.setToken(null));
    }
}

export function fetchDeleteAccount(account) {
    return axios.delete(api(`/api/v1/account/${account}/`))
}

export function *deleteAccountSaga(action) {
    try {
        const target = action.payload;

        yield call(() => fetchDeleteAccount(target));
        yield put(loadAccounts());
    } catch(error) {
        yield put(user.actions.setToken(null));
    }
}
