import { createSlice } from "@reduxjs/toolkit";

const initialState = [];

export const operatorsHistory = createSlice({
    name: "operatorsHistory",
    initialState,
    reducers: {
        addOperatorsHistory: (state, action) => {
            const payload = action.payload;
            return payload;
        },
        unsetOperatorsHistory: (state, action) => {
            return initialState;
        },
    },
});

export const { addOperatorsHistory, unsetOperatorsHistory } = operatorsHistory.actions;

export default operatorsHistory.reducer;
