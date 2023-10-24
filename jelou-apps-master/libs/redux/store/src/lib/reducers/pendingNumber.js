import { createSlice } from "@reduxjs/toolkit";

const initialState = 0;

export const pendingNumber = createSlice({
    name: "pendingNumber",
    initialState,
    reducers: {
        setPendingNumber: (state, action) => {
            return action.payload;
        },
    },
});

export const { setPendingNumber } = pendingNumber.actions;

export default pendingNumber.reducer;
