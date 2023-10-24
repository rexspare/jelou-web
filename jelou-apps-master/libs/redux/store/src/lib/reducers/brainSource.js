import { createSlice } from "@reduxjs/toolkit";

const initialState = {};

export const source = createSlice({
    name: "source",
    initialState,
    reducers: {
        setSource: (state, action) => {
            return action.payload;
        },
    },
});

export const { setSource } = source.actions;

export default source.reducer;