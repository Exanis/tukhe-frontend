import rootSaga from './index';

it('Should have all the correct listeners', () => {
    const gen = rootSaga();

    expect(gen.next()).toMatchSnapshot();
    expect(gen.next().done).toBeTruthy();
});
