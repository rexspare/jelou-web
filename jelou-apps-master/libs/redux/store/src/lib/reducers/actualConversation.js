import { createSlice } from "@reduxjs/toolkit";

const initialState = "--";

export const actualConversation = createSlice({
    name: "actualConversation",
    initialState,
    reducers: {
        setActualConversation: (state, action) => {
            return action.payload;
        },
        unsetActualConversation: () => {
            return initialState;
        },
    },
});

export const { setActualConversation, unsetActualConversation } = actualConversation.actions;

export default actualConversation.reducer;
