import { createSlice } from "@reduxjs/toolkit";

const initialState = {};

export const chatManager = createSlice({
    name: "chatManager",
    initialState,
    reducers: {
        setChatManager: (state, action) => {
            return action.payload;
        },
    },
});

export const { setChatManager } = chatManager.actions;

export default chatManager.reducer;
