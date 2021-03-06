import {call, put, delay} from 'redux-saga/effects';
import axios from 'axios';

import {api} from "../../../services/path";
import {oauth1Popup, pollOauth1Popup} from "../../../services/oauth";

import {loadAccounts} from "../../../actions/account/";

function fetchTwitterLoginToken() {
    return axios.post(
        api('/api/login/social/knox/twitter'),
        {}
    );
}

function performTwitterAuth(token) {
    return oauth1Popup(
        'https://api.twitter.com/oauth/authenticate',
        token,
        495,
        650
    );
}

export function pollTwitterPopup(popup) {
    const result = pollOauth1Popup(popup);

    return result;
}

function finalizeTwitterLogin(token, verifier) {
    return axios.post(
        api('/api/login/social/knox/twitter'),
        {
            oauth_token: token,
            oauth_verifier: verifier
        }
    );
}

export default function *twitterLoginSaga() {
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
            yield put(loadAccounts());
    } catch (error) {
        console.log(error);
    }
}
