import axios from 'axios';
import slice, { selectUser } from './index';

it('Should have correct reducers', () => {
    const state = {
        token: false,
        dashboards: [],
        currentDashboard: null,
        widgets: []
    };
    const action = {
        type: slice.actions.setToken,
        payload: 'test'
    };

    jest.spyOn(Storage.prototype, 'setItem');
    expect(slice.reducer(state, action)).toMatchSnapshot();
    expect(Storage.prototype.setItem).toHaveBeenCalledWith('tukhe-token', 'test');
    expect(axios.defaults.headers.common).toMatchSnapshot();

    action.payload = null;
    expect(slice.reducer(state, action)).toMatchSnapshot();
    expect(axios.defaults.headers.common).toEqual({});

    action.type = slice.actions.setDashboards;
    action.payload = 'test';
    expect(slice.reducer(state, action)).toMatchSnapshot();

    action.type = slice.actions.selectDashboard;
    expect(slice.reducer(state, action)).toMatchSnapshot();

    action.type = slice.actions.setWidgets;
    expect(slice.reducer(state, action)).toMatchSnapshot();
});

it('Should correctly select user', () => {
    const state = {
        user: 'test',
        error: 'bad'
    };

    expect(selectUser(state)).toEqual('test');
});
