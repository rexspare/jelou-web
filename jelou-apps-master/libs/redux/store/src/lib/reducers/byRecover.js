import { createSlice } from "@reduxjs/toolkit";

const initialState = 0;

export const byRecover = createSlice({
    name: "byRecover",
    initialState,
    reducers: {
        setByRecover: (state, action) => {
            return action.payload;
        },
    },
});

export const { setByRecover } = byRecover.actions;

export default byRecover.reducer;
