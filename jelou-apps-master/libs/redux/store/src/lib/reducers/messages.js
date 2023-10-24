import { createSlice } from "@reduxjs/toolkit";

import { mergeById, updateIdById } from "@apps/shared/utils";
const initialState = [];

export const messages = createSlice({
    name: "messages",
    initialState,
    reducers: {
        ackMessage: (state, action) => {
            return updateIdById(state, action.payload, "oldId");
        },
        addMessages: (state, action) => {
            return mergeById(state, action.payload);
        },
        addMessage: (state, action) => {
            const payload = action.payload;
            return mergeById(state, payload);
        },
        updateMessage: (state, action) => {
            return mergeById(state, action.payload);
        },
        removeRoomMessages: (state, action) => {
            const roomId = action.payload;
            return state.filter((message) => message.roomId !== roomId);
        },
        addMailsMessages: (state, action) => {
            return [...action.payload];
        },
        setMessages: (state, action) => {
            return [...action.payload];
        },
        deleteMessages: (state, action) => {
            return initialState;
        },
    },
});

export const { ackMessage, addMessages, addMessage, updateMessage, removeRoomMessages, addMailsMessages, setMessages, deleteMessages } =
    messages.actions;

export default messages.reducer;
