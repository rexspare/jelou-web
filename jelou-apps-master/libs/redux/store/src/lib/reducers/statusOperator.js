import { createSlice } from "@reduxjs/toolkit";

const initialState = "";

export const statusOperator = createSlice({
    name: "statusOperator",
    initialState,
    reducers: {
        setStatusOperator: (state, action) => {
            const payload = action.payload;
            return payload;
        },
    },
});

export const { setStatusOperator } = statusOperator.actions;

export default statusOperator.reducer;
