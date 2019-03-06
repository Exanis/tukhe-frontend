import { createSlice } from "redux-starter-kit";

export default createSlice({
    slice: 'user',
    initialState: {
        token: null,
        dashboard: {
            layout: null
        }
    },
    reducers: {
        setToken: (state, action) => {
            state.token = action.payload;
        },
        setDashboard: (state, action) => {
            state.dashboard = action.payload;
        }
    }
});