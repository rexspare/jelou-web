import { createSlice } from "@reduxjs/toolkit";

const initialState = "";

export const emailQuerySearch = createSlice({
    name: "emailQuerySearch",
    initialState,
    reducers: {
        addEmailQuerySearch: (state, action) => {
            return action.payload;
        },
        deleteEmailQuerySearch: () => {
            return initialState;
        },
    },
});

export const { addEmailQuerySearch, deleteEmailQuerySearch } = emailQuerySearch.actions;

export default emailQuerySearch.reducer;
