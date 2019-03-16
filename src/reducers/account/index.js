import { createSlice } from "redux-starter-kit";

export default createSlice({
    slice: 'account',
    initialState: {
        accounts: []
    },
    reducers: {
        setAccounts: (state, action) => {
            state.accounts = action.payload;
        }
    }
});
