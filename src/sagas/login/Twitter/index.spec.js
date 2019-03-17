import TwitterLoginSaga, * as saga from './index';

window.open = jest.fn();

window.open.mockImplementation(() => {
    return true;
});

it('Should execute steps as expected when there is no token', () => {
    const gen = saga.twitterLoginSaga();

    jest.spyOn(saga, 'pollTwitterPopup');
    saga.pollTwitterPopup.mockImplementation(() => {
        return false;
    });

    const twitterFetch = gen.next();

    expect(twitterFetch).toMatchSnapshot();
    expect(twitterFetch.value.payload.fn()).toMatchSnapshot();
    expect(gen.next({
        data: {
            oauth_token: 'test'
        }
    })).toMatchSnapshot();

    const finalizePreparation = gen.next();

    expect(finalizePreparation).toMatchSnapshot();
    expect(finalizePreparation.value.payload.fn()).toMatchSnapshot();
    expect(gen.next({data: {}}).done).toBeTruthy();
});

it('Should execute steps as expected when there is a token', () => {
    jest.spyOn(saga, 'pollTwitterPopup');
    saga.pollTwitterPopup.mockImplementation(() => {
        return false;
    });

    const gen = saga.twitterLoginSaga();
    const twitterFetch = gen.next();

    expect(twitterFetch).toMatchSnapshot();
    expect(twitterFetch.value.payload.fn()).toMatchSnapshot();
    expect(gen.next({
        data: {
            oauth_token: 'test'
        }
    })).toMatchSnapshot();

    const finalizePreparation = gen.next();

    expect(finalizePreparation).toMatchSnapshot();
    expect(finalizePreparation.value.payload.fn()).toMatchSnapshot();
    expect(gen.next({data: {
        token: 'test'
    }})).toMatchSnapshot();
    expect(gen.next().done).toBeTruthy();
});

it('Should execute steps as expected when popup cannot open', () => {
    const gen = saga.twitterLoginSaga();

    window.open.mockImplementation(() => {
        return null;
    });
    const twitterFetch = gen.next();

    expect(twitterFetch).toMatchSnapshot();
    expect(gen.next({
        data: {
            oauth_token: 'test'
        }
    })).toMatchSnapshot();
    expect(gen.next().done).toBeTruthy();
});

it('Should handle error as expected', () => {
    const gen = saga.twitterLoginSaga();

    gen.next();
    gen.throw('error');
    gen.next();
    expect(gen.next().done).toBeTruthy();
});

it('Should have a watcher', () => {
    const gen = TwitterLoginSaga();

    expect(gen.next()).toMatchSnapshot();
    expect(gen.next().done).toBeTruthy();
});
