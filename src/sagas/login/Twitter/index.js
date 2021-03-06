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
        {}
    );
}

export function performTwitterAuth(token) {
    const popup = oauth1Popup(
        'https://api.twitter.com/oauth/authenticate',
        token,
        495,
        650
    );

    return popup;
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

export function *twitterLoginSaga() {
    try {
        const authToken = yield call(fetchTwitterLoginToken);
        const popup = performTwitterAuth(authToken.data.oauth_token);

        if (popup === null) {
            yield put(user.actions.warnForPopupError());
        } else {
            let result = true;

            while (result === true) {
                yield delay(500);
                result = pollTwitterPopup(popup);
            }
            result = yield call(() => finalizeTwitterLogin(result.oauth_token, result.oauth_verifier));

            if (result.data.token)
                yield put(user.actions.setToken(result.data.token));
        }
    } catch (error) {
        console.log(error);
    }
}
