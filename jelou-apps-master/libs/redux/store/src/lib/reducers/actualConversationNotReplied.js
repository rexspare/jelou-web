import { createSlice } from "@reduxjs/toolkit";

const initialState = "--";

export const actualConversationNotReplied = createSlice({
    name: "actualConversationNotReplied",
    initialState,
    reducers: {
        setActualConversationNotReplied: (state, action) => {
            return action.payload;
        },
        unsetActualConversationNotReplied: () => {
            return initialState;
        },
    },
});

export const { setActualConversationNotReplied, unsetActualConversationNotReplied } = actualConversationNotReplied.actions;

export default actualConversationNotReplied.reducer;
