import { createSlice } from "@reduxjs/toolkit";

const initialState = 0;

export const actualTray = createSlice({
    name: "actualTray",
    initialState,
    reducers: {
        setActualTray: (state, action) => {
            return action.payload;
        },
    },
});

export const { setActualTray } = actualTray.actions;

export default actualTray.reducer;
