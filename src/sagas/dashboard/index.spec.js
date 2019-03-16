import watcherSaga, * as sagas from './index';

it('Should watch every sagas', () => {
    const gen = watcherSaga();

    expect(gen.next()).toMatchSnapshot();
    expect(gen.next()).toMatchSnapshot();
    expect(gen.next()).toMatchSnapshot();
    expect(gen.next()).toMatchSnapshot();
    expect(gen.next()).toMatchSnapshot();
    expect(gen.next()).toMatchSnapshot();
    expect(gen.next()).toMatchSnapshot();
    expect(gen.next()).toMatchSnapshot();
    expect(gen.next()).toMatchSnapshot();
    expect(gen.next()).toMatchSnapshot();
    expect(gen.next().done).toBeTruthy();
});

it('Should process saga as expected', () => {
    const gen = sagas.startProcessSaga({
        payload: {
            target: jest.fn(),
            interval: 'test interval',
            widget: 'test widget'
        }
    });
    const forkExecutor = gen.next();

    expect(forkExecutor).toMatchSnapshot();
    const forkFunction = forkExecutor.value.payload.fn();

    expect(forkFunction.next()).toMatchSnapshot();
    expect(forkFunction.next()).toMatchSnapshot();
    forkFunction.throw('end');
    expect(forkFunction.next().done).toBeTruthy();
    expect(gen.next()).toMatchSnapshot();
    expect(gen.next({
        payload: {
            widget: 'test widget'
        }
    })).toMatchSnapshot();
    expect(gen.next()).toMatchSnapshot();
    expect(gen.next().done).toBeTruthy();
});

it('Should run select dashboard saga as expected', () => {
    const gen = sagas.selectDashboardSaga({
        payload: 'test'
    });
    const request = gen.next();

    expect(request).toMatchSnapshot();
    expect(request.value.payload.fn()).toMatchSnapshot();
    expect(gen.next({
        data: []
    })).toMatchSnapshot();
    expect(gen.next()).toMatchSnapshot();
    expect(gen.next().done).toBeTruthy();
});

it('Should run select dashboard saga as expected when there is an error', () => {
    const gen = sagas.selectDashboardSaga({
        payload: 'test'
    });
    const request = gen.next();

    expect(request).toMatchSnapshot();
    gen.throw('err');
    expect(gen.next()).toMatchSnapshot();
    expect(gen.next().done).toBeTruthy();
});

it('Should run dashboard load saga as expected', () => {
    const gen = sagas.loadDashboardSaga();
    const fetch = gen.next();

    expect(fetch).toMatchSnapshot();
    expect(fetch.value.payload.fn()).toMatchSnapshot();
    expect(gen.next({data: [
        {
            uuid: 'test'
        }
    ]})).toMatchSnapshot();
    expect(gen.next({
        currentDashboard: null
    })).toMatchSnapshot();
    expect(gen.next()).toMatchSnapshot();
    expect(gen.next().done).toBeTruthy();
});

it('Should run dashboard load saga as expected when there is a dashboard', () => {
    const gen = sagas.loadDashboardSaga();
    const fetch = gen.next();

    expect(fetch).toMatchSnapshot();
    expect(fetch.value.payload.fn()).toMatchSnapshot();
    expect(gen.next({data: [
        {
            uuid: 'test'
        }
    ]})).toMatchSnapshot();
    expect(gen.next({
        currentDashboard: 'something'
    })).toMatchSnapshot();
    expect(gen.next().done).toBeTruthy();
});

it('Should run dashboard load saga as expected when there is an error', () => {
    const gen = sagas.loadDashboardSaga();
    const fetch = gen.next();

    expect(fetch).toMatchSnapshot();
    gen.throw('test');
    expect(gen.next()).toMatchSnapshot();
    expect(gen.next().done).toBeTruthy();
});

it('Should run create dashboard saga as expected', () => {
    const gen = sagas.createDashboardSaga({
        payload: 'home'
    });
    const request = gen.next();

    expect(request).toMatchSnapshot();
    expect(request.value.payload.fn()).toMatchSnapshot();
    expect(gen.next()).toMatchSnapshot();
    expect(gen.next()).toMatchSnapshot();
    expect(gen.next().done).toBeTruthy();
});

it('Should run create saga as expected when there is an error', () => {
    const gen = sagas.createDashboardSaga({
        payload: 'home'
    });

    gen.next();
    gen.throw('err');
    expect(gen.next()).toMatchSnapshot();
    expect(gen.next().done).toBeTruthy();
});

it('Should run create widget saga as expected', () => {
    const gen = sagas.createWidgetSaga({
        payload: {
            title: 'test',
            header: true,
            type: 'twitter_feed',
            config: {
                target: 'test'
            },
            accounts: [
                'test',
                'test2'
            ]
        }
    });
    expect(gen.next()).toMatchSnapshot();

    const request = gen.next({
        currentDashboard: 'test'
    });

    expect(request).toMatchSnapshot();
    expect(request.value.payload.fn()).toMatchSnapshot();

    const associate = gen.next({data: {uuid: 'test'}});

    expect(associate).toMatchSnapshot();
    expect(associate.value.payload[0]).toMatchSnapshot();
    expect(associate.value.payload[1]).toMatchSnapshot();
    expect(gen.next()).toMatchSnapshot();
    expect(gen.next().done).toBeTruthy();
});

it('Should run create widget saga as expected when there is an error', () => {
    const gen = sagas.createWidgetSaga({
        payload: {
            title: 'test',
            header: true,
            type: 'twitter_feed',
            config: {
                target: 'test'
            },
            accounts: [
                'test',
                'test2'
            ]
        }
    });
    expect(gen.next()).toMatchSnapshot();
    gen.throw('err');
    expect(gen.next()).toMatchSnapshot();
    expect(gen.next().done).toBeTruthy();
});

it('Should run update layout saga as expected', () => {
    const gen = sagas.updateDashboardLayoutSaga({
        payload: {}
    });
    expect(gen.next()).toMatchSnapshot();
    const request = gen.next({
        currentDashboard: 'test'
    });

    expect(request).toMatchSnapshot();
    expect(request.value.payload.fn()).toMatchSnapshot();
    expect(gen.next()).toMatchSnapshot();
    expect(gen.next().done).toBeTruthy();
});

it('Should run update layout saga as expected when there is an error', () => {
    const gen = sagas.updateDashboardLayoutSaga({
        payload: {}
    });
    expect(gen.next()).toMatchSnapshot();
    gen.throw('err');
    expect(gen.next()).toMatchSnapshot();
    expect(gen.next().done).toBeTruthy();
});

it('Should run refresh with account saga as expected', () => {
    const gen = sagas.refreshWidgetWithAccountSaga({
        payload: 'test'
    });

    expect(gen.next()).toMatchSnapshot();

    const request = gen.next({
        currentDashboard: 'test'
    });

    expect(request).toMatchSnapshot();
    expect(request.value.payload.fn()).toMatchSnapshot();
    expect(gen.next({
        data: []
    })).toMatchSnapshot();
    expect(gen.next().done).toBeTruthy();
});

it('Should run refresh with account saga as expected when there is an error', () => {
    const gen = sagas.refreshWidgetWithAccountSaga({
        payload: 'test'
    });

    expect(gen.next()).toMatchSnapshot();
    gen.throw('err');
    expect(gen.next()).toMatchSnapshot();
    expect(gen.next().done).toBeTruthy();
});

it('Should run refresh without account saga as expected', () => {
    const gen = sagas.refreshWidgetWithoutAccountSaga({
        payload: 'test'
    });

    expect(gen.next()).toMatchSnapshot();

    const request = gen.next({
        currentDashboard: 'test'
    });

    expect(request).toMatchSnapshot();
    expect(request.value.payload.fn()).toMatchSnapshot();
    expect(gen.next({
        data: []
    })).toMatchSnapshot();
    expect(gen.next().done).toBeTruthy();
});

it('Should run refresh without account saga as expected when there is an error', () => {
    const gen = sagas.refreshWidgetWithoutAccountSaga({
        payload: 'test'
    });

    expect(gen.next()).toMatchSnapshot();
    gen.throw('err');
    expect(gen.next()).toMatchSnapshot();
    expect(gen.next().done).toBeTruthy();
});

it('Should run action with account as expected when param is not a formdata', () => {
    const gen = sagas.widgetActionWithAccountSaga({payload: {
        action: 'test',
        params: {}
    }});

    expect(gen.next()).toMatchSnapshot();

    const request = gen.next({
        currentDashboard: 'dashboard'
    });
    expect(request).toMatchSnapshot();
    expect(request.value.payload.fn()).toMatchSnapshot();
    expect(gen.next()).toMatchSnapshot();
    expect(gen.next().done).toBeTruthy();
});

it('Should run action with account as expected when param is a formdata', () => {
    const params = {
        action: 'test',
        params: new FormData(),
        callback: jest.fn()
    };
    const gen = sagas.widgetActionWithAccountSaga({payload: params});

    expect(gen.next()).toMatchSnapshot();

    const request = gen.next({
        currentDashboard: 'dashboard'
    });
    expect(request).toMatchSnapshot();
    expect(request.value.payload.fn()).toMatchSnapshot();
    expect(gen.next()).toMatchSnapshot();
    expect(gen.next().done).toBeTruthy();
});

it('Should run action with account as expected when param is not a formdata', () => {
    const gen = sagas.widgetActionWithAccountSaga({payload: {
        action: 'test',
        params: {}
    }});

    expect(gen.next()).toMatchSnapshot();
    gen.throw('err');
    expect(gen.next()).toMatchSnapshot();
    expect(gen.next().done).toBeTruthy();
});

it('Should run action without account as expected when param is not a formdata', () => {
    const gen = sagas.widgetActionWithoutAccountSaga({payload: {
        action: 'test',
        params: {}
    }});

    expect(gen.next()).toMatchSnapshot();

    const request = gen.next({
        currentDashboard: 'dashboard'
    });
    expect(request).toMatchSnapshot();
    expect(request.value.payload.fn()).toMatchSnapshot();
    expect(gen.next()).toMatchSnapshot();
    expect(gen.next().done).toBeTruthy();
});

it('Should run action without account as expected when param is a formdata', () => {
    const params = {
        action: 'test',
        params: new FormData(),
        callback: jest.fn()
    };
    const gen = sagas.widgetActionWithoutAccountSaga({payload: params});

    expect(gen.next()).toMatchSnapshot();

    const request = gen.next({
        currentDashboard: 'dashboard'
    });
    expect(request).toMatchSnapshot();
    expect(request.value.payload.fn()).toMatchSnapshot();
    expect(gen.next()).toMatchSnapshot();
    expect(gen.next().done).toBeTruthy();
});

it('Should run action without account as expected when param is not a formdata', () => {
    const gen = sagas.widgetActionWithoutAccountSaga({payload: {
        action: 'test',
        params: {}
    }});

    expect(gen.next()).toMatchSnapshot();
    gen.throw('err');
    expect(gen.next()).toMatchSnapshot();
    expect(gen.next().done).toBeTruthy();
});
