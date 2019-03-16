import loginSaga from './index';

it('Should have all the correct listeners', () => {
    const gen = loginSaga();

    expect(gen.next()).toMatchSnapshot();
    expect(gen.next().done).toBeTruthy();
});
