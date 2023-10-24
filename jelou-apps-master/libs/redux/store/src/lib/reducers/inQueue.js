import { createSlice } from "@reduxjs/toolkit";

const initialState = 0;

export const inQueue = createSlice({
    name: "inQueue",
    initialState,
    reducers: {
        setInQueue: (state, action) => {
            return action.payload;
        },
    },
});

export const { setInQueue } = inQueue.actions;

export default inQueue.reducer;
