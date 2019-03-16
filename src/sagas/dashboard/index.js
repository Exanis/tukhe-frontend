import {takeLatest, takeEvery, call, put, select, all, delay, fork, cancel, take} from 'redux-saga/effects';
import axios from 'axios';

import {api} from '../../services/path';
import dashboard, {selectDashboard as dashboardSelector} from '../../reducers/dashboard';
import user from '../../reducers/user';

import {
    loadDashboards,
    selectDashboard,
    createDashboard,
    createWidget,
    updateDashboardLayout,
    refreshWidgetWithAccount,
    refreshWidgetWithoutAccount,
    widgetActionWithAccount,
    widgetActionWithoutAccount,
    startWidgetProcess,
    stopWidgetProcess
} from '../../actions/dashboard';

export default function* watcherSaga() {
    yield takeLatest(loadDashboards, loadDashboardSaga);
    yield takeLatest(selectDashboard, selectDashboardSaga);
    yield takeLatest(createDashboard, createDashboardSaga);
    yield takeLatest(createWidget, createWidgetSaga);
    yield takeLatest(updateDashboardLayout, updateDashboardLayoutSaga);
    yield takeEvery(refreshWidgetWithAccount, refreshWidgetWithAccountSaga);
    yield takeEvery(refreshWidgetWithoutAccount, refreshWidgetWithoutAccountSaga);
    yield takeEvery(widgetActionWithAccount, widgetActionWithAccountSaga);
    yield takeEvery(widgetActionWithoutAccount, widgetActionWithoutAccountSaga);
    yield takeEvery(startWidgetProcess, startProcessSaga);
}

export function *startProcessSaga(action) {
    const target = action.payload.target;
    const interval = action.payload.interval;
    const widget = action.payload.widget;

    function *processSagaExecutor() {
        try {
            while (true) {
                yield call(target);
                yield delay(interval);
            }
        } catch (error) {
            console.log(error);
        } finally {

        }
    }

    const executor = yield fork(processSagaExecutor);
    let found = '';

    while (found !== widget)
        found = (yield take(stopWidgetProcess)).payload.widget;
    yield cancel(executor);
}

function fetchWidgetList(dashboard) {
    return axios.get(api(`/api/v1/dashboard/${dashboard}/widget/`));
}

export function *selectDashboardSaga(action) {
    const targetDashboard = action.payload;

    try {
        const widgets = yield call(() => fetchWidgetList(targetDashboard));

        yield put(dashboard.actions.selectDashboard(targetDashboard));
        yield put(dashboard.actions.setWidgets(widgets.data));
    } catch (error) {
        yield put(user.actions.setToken(null));
    }
}

function fetchDashboardsList() {
    return axios.get(api('/api/v1/dashboard/'));
}

export function *loadDashboardSaga() {
    try {
        const result = yield call(fetchDashboardsList);
        const stateDashboard = yield select(dashboardSelector);

        yield put(dashboard.actions.setDashboards(result.data));

        if (stateDashboard.currentDashboard === null) {
            yield put(selectDashboard(result.data[0].uuid));
        }
    } catch(error) {
        yield put(user.actions.setToken(null));
    }
}

function createDashboardRequest(icon) {
    return axios.post(
        api('/api/v1/dashboard/'),
        {
            icon: icon
        }
    );
}

export function *createDashboardSaga(action) {
    try {
        const newDashboard = yield call(() => createDashboardRequest(action.payload));

        yield put(loadDashboards());
        yield put(selectDashboard(newDashboard.data.uuid));
    } catch(error) {
        yield put(user.actions.setToken(null));
    }
}

function createWidgetRequest(dashboard, title, header, type, config) {
    return axios.post(
        api(`/api/v1/dashboard/${dashboard}/widget/`),
        {
            dashboard: dashboard,
            title: title,
            header: header,
            type: type,
            config: config
        }
    );
}

function associateAccountRequest(dashboard, widget, account) {
    return axios.post(
        api(`/api/v1/dashboard/${dashboard}/widget/${widget}/link/`),
        {
            account: account
        }
    )
}

export function *createWidgetSaga(action) {
    try {
        const stateDashboard = yield select(dashboardSelector);
        const dashboard = stateDashboard.currentDashboard;
        const widget = yield call(() => createWidgetRequest(
            dashboard,
            action.payload.title,
            action.payload.header,
            action.payload.type,
            action.payload.config)
        );

        yield all(
            action.payload.accounts.map(
                account => associateAccountRequest(
                    dashboard,
                    widget.data.uuid,
                    account
                )
            )
        );
        yield put(selectDashboard(dashboard));
    } catch (error) {
        yield put(user.actions.setToken(null));
    }
}

function updateDashboardLayoutRequest(dashboard, layout) {
    return axios.patch(
        api(`/api/v1/dashboard/${dashboard}/`),
        {
            layout: layout
        }
    );
}

export function *updateDashboardLayoutSaga(action) {
    try {
        const stateDashboard = yield select(dashboardSelector);
        const dashboard = stateDashboard.currentDashboard;
        yield call(() => updateDashboardLayoutRequest(dashboard, action.payload));
        yield put(loadDashboards());
    } catch (error) {
        yield put(user.actions.setToken(null));
    }
}

function refreshWidgetWithAccountRequest(dashboard, widget) {
    return axios.get(
        api(`/api/v1/dashboard/${dashboard}/widget/${widget}/update_with_auth/`)
    )
}

export function *refreshWidgetWithAccountSaga(action) {
    try {
        const stateDashboard = yield select(dashboardSelector);
        const dashboardId = stateDashboard.currentDashboard;
        const result = yield call(() => refreshWidgetWithAccountRequest(dashboardId, action.payload))
        const payload = {
            widget: action.payload,
            data: result.data
        };

        yield put(dashboard.actions.setData(payload));
    } catch (error) {
        yield put(user.actions.setToken(null));
    }
}

function refreshWidgetWithoutAccountRequest(dashboard, widget) {
    return axios.get(
        api(`/api/v1/dashboard/${dashboard}/widget/${widget}/update_no_auth/`)
    )
}

export function *refreshWidgetWithoutAccountSaga(action) {
    try {
        const stateDashboard = yield select(dashboardSelector);
        const dashboardId = stateDashboard.currentDashboard;
        const result = yield call(() => refreshWidgetWithoutAccountRequest(dashboardId, action.payload))
        const payload = {
            widget: action.payload,
            data: result.data
        };

        yield put(dashboard.actions.setData(payload));
    } catch (error) {
        yield put(user.actions.setToken(null));
    }
}

function widgetActionWithAccountRequest(dashboard, widget, data) {
    return axios.post(
        api(`/api/v1/dashboard/${dashboard}/widget/${widget}/action_with_auth/`),
        data
    )
}

export function *widgetActionWithAccountSaga(action) {
    try {
        const stateDashboard = yield select(dashboardSelector);
        const dashboardId = stateDashboard.currentDashboard;
        const data = action.payload.params;

        if (data instanceof FormData)
            data.append('action', action.payload.action);
        else
            data['action'] = action.payload.action;

        const result = yield call(() => widgetActionWithAccountRequest(dashboardId, action.payload.widget, data));

        if (action.payload.callback)
            action.payload.callback(result.data);
    } catch (error) {
        yield put(user.actions.setToken(null));
    }
}

function widgetActionWithoutAccountRequest(dashboard, widget, data) {
    return axios.post(
        api(`/api/v1/dashboard/${dashboard}/widget/${widget}/action_no_auth/`),
        data
    )
}

export function *widgetActionWithoutAccountSaga(action) {
    try {
        const stateDashboard = yield select(dashboardSelector);
        const dashboardId = stateDashboard.currentDashboard;
        const data = action.payload.params;

        if (data instanceof FormData)
            data.append('action', action.payload.action);
        else
            data['action'] = action.payload.action;

        const result = yield call(() => widgetActionWithoutAccountRequest(dashboardId, action.payload.widget, data));

        if (action.payload.callback)
            action.payload.callback(result.data)
    } catch (error) {
        yield put(user.actions.setToken(null));
    }
}
