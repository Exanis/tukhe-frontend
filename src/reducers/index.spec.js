import store from './index';

it('Should configure store as expected', () => {
    expect(store).toMatchSnapshot()
});
