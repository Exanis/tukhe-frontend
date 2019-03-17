import axios from 'axios';
import { createSlice } from "redux-starter-kit";

export default createSlice({
    slice: 'user',
    initialState: {
        token: false,
        dashboards: [],
        currentDashboard: null,
        widgets: [],
        popupError: false
    },
    reducers: {
        setToken: (state, action) => {
            state.token = action.payload;
            localStorage.setItem('tukhe-token', state.token);
            if (action.payload) {
                axios.defaults.headers.common = {'Authorization': `Token ${action.payload}`}
            } else {
                axios.defaults.headers.common = {}
            }
        },
        setDashboards: (state, action) => {
            state.dashboards = action.payload;
        },
        selectDashboard: (state, action) => {
            state.currentDashboard = action.payload;
        },
        setWidgets: (state, action) => {
            state.widgets = action.payload;
        },
        warnForPopupError: (state, action) => {
            state.popupError = true;
        }
    }
});

export function selectUser(state) {
    return state.user;
}
