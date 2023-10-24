import { createSlice } from "@reduxjs/toolkit";

const initialState = 0;

export const operatorAvgResponseTime = createSlice({
    name: "operatorAvgResponseTime",
    initialState,
    reducers: {
        updateOperatorAvgResponseTime: (state, action) => {
            const payload = action.payload;
            return payload;
        },
    },
});

export const { updateOperatorAvgResponseTime } = operatorAvgResponseTime.actions;

export default operatorAvgResponseTime.reducer;
