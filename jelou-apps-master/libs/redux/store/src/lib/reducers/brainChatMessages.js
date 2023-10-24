import { createSlice } from "@reduxjs/toolkit";

const initialState = [];

export const chatMessages = createSlice({
    name: "chatMessages",
    initialState,
    reducers: {
        addChatMessages: (state, action) => {
            return [...state, action.payload];
        },
        resetChatMessages : (state, action) => {
            return initialState;
        },
    },
});

export const { addChatMessages, resetChatMessages } = chatMessages.actions;

export default chatMessages.reducer;