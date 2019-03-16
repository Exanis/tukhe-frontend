import slice, { selectDashboard } from './index';

it('Should correctly use reducers', () => {
    const state = {
        dashboards: [],
        currentDashboard: null,
        widgets: [],
        data: {}
    };
    const action = {
        type: slice.actions.setDashboards,
        payload: ['test', 'test2']
    };

    expect(slice.reducer(state, action)).toMatchSnapshot();

    action.type = slice.actions.setWidgets;
    expect(slice.reducer(state, action)).toMatchSnapshot();

    action.type = slice.actions.selectDashboard;
    action.payload = 'test';
    expect(slice.reducer(state, action)).toMatchSnapshot();

    action.type = slice.actions.setData;
    action.payload = {
        widget: 'test',
        data: 'value'
    };
    expect(slice.reducer(state, action)).toMatchSnapshot();

    action.type = slice.actions.updateWidgetData;
    action.payload = {
        widget: 'test',
        select: el => el === 4,
        update: el => el + 2
    };
    state.data['test'] = [4, 5];
    expect(slice.reducer(state, action)).toMatchSnapshot();

    action.type = slice.actions.addToWidgetData;
    action.payload = {
        widget: 'test',
        elements: [1, 2, 3]
    };
    state.data['test'] = [4, 5];
    expect(slice.reducer(state, action)).toMatchSnapshot();
});

it('Should correctly select dashboards', () => {
    const state = {
        dashboard: 'test',
        error: 'bad'
    };

    expect(selectDashboard(state)).toEqual('test');
});
