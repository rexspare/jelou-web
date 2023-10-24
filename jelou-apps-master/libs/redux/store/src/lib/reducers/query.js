import { createSlice } from "@reduxjs/toolkit";

const initialState = {};

export const query = createSlice({
    name: "query",
    initialState,
    reducers: {
        setQuery: (state, action) => {
            return action.payload;
        },
    },
});

export const { setQuery } = query.actions;

export default query.reducer;
