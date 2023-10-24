import { createSlice } from "@reduxjs/toolkit";

const initialState = [];

export const clientsMessages = createSlice({
    name: "messages",
    initialState,
    reducers: {
        addClientsMessages: (state, action) => {
            return action.payload;
        },
        addClientsMessage: (state, action) => {
            return { ...state, ...action.payload };
        },
        deleteClientsMessages: (state, action) => {
            return initialState;
        },
    },
});

export const { addClientsMessages, addClientsMessage, deleteClientsMessages } = clientsMessages.actions;

export default clientsMessages.reducer;
