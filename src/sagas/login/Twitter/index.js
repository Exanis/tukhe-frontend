import {takeLatest, call, put, delay} from 'redux-saga/effects';
import axios from 'axios';

import {api} from "../../../services/path";
import {oauth1Popup, pollOauth1Popup} from "../../../services/oauth";

import {twitterLogin} from "../../../actions/login";
import user from "../../../reducers/user";

export default function* watcherSaga() {
    yield takeLatest(twitterLogin, twitterLoginSaga);
}

function fetchTwitterLoginToken() {
    return axios.post(
        api('/api/login/social/knox/twitter'),
        {},
        {withCredentials: true}
    );
}

function performTwitterAuth(token) {
    return oauth1Popup(
        'https://api.twitter.com/oauth/authenticate',
        token,
        650,
        495
    );
}

function pollTwitterPopup(popup) {
    const result = pollOauth1Popup(popup);

    return result;
}

function finalizeTwitterLogin(token, verifier) {
    return axios.post(
        api('/api/login/social/knox/twitter'),
        {
            oauth_token: token,
            oauth_verifier: verifier
        },
        {withCredentials: true}
    );
}

function *twitterLoginSaga() {
    try {
        const authToken = yield call(fetchTwitterLoginToken);
        const popup = performTwitterAuth(authToken.data.oauth_token);
        let result = true;

        while (result === true) {
            yield delay(500);
            result = pollTwitterPopup(popup);
        }
        result = yield call(() => finalizeTwitterLogin(result.oauth_token, result.oauth_verifier));

        if (result.data.token)
            yield put(user.actions.setToken(result.data.token));
    } catch (error) {
        console.log(error);
    }
}