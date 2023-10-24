import { createSlice } from "@reduxjs/toolkit";

const initialState = true;

export const scrollUp = createSlice({
    name: "scrollUp",
    initialState,
    reducers: {
        isScrollingUp: (state, action) => {
            return action.payload;
        },
    },
});

export const { isScrollingUp } = scrollUp.actions;

export default scrollUp.reducer;
