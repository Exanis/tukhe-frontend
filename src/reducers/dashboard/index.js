import { createSlice } from "redux-starter-kit";

export default createSlice({
    slice: 'dashboard',
    initialState: {
        dashboards: [],
        currentDashboard: null,
        widgets: [],
        data: {}
    },
    reducers: {
        setDashboards: (state, action) => {
            state.dashboards = action.payload;
        },
        selectDashboard: (state, action) => {
            state.currentDashboard = action.payload;
        },
        setWidgets: (state, action) => {
            state.widgets = action.payload;
        },
        setData: (state, action) => {
            state.data[action.payload.widget] = action.payload.data
        },
        updateWidgetData: (state, action) => {
            state.data[action.payload.widget].forEach((element, index) => {
                if (action.payload.select(element)) {
                    state.data[action.payload.widget][index] = action.payload.update(element);
                }
            });
        },
        addToWidgetData: (state, action) => {
            state.data[action.payload.widget] = [
                ...action.payload.elements,
                ...state.data[action.payload.widget]
            ];
        }
    }
});

export function selectDashboard(state) {
    return state.dashboard;
}
