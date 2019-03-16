import slice from './index';

it('Should update state with action', () => {
    const state = {};
    const action = {
        type: slice.actions.setAccounts,
        payload: 'test'
    };

    expect(slice.reducer(state, action)).toMatchSnapshot();
});
