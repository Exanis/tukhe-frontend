import TwitterLoginSaga, * as saga from './index';

window.open = jest.fn();

it('Should execute steps as expected when there is no token', () => {
    const gen = TwitterLoginSaga();

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
    const gen = TwitterLoginSaga();

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
    expect(gen.next({data: {
        token: 'test'
    }})).toMatchSnapshot();
    expect(gen.next().done).toBeTruthy();
});

it('Should handle error as expected', () => {
    const gen = TwitterLoginSaga();

    gen.next();
    gen.throw('error');
    gen.next();
    expect(gen.next().done).toBeTruthy();
});
