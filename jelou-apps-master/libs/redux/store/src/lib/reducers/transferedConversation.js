import { createSlice } from "@reduxjs/toolkit";

const initialState = "--";

export const transferedConversation = createSlice({
    name: "transferedConversation",
    initialState,
    reducers: {
        setTransferedConversation: (state, action) => {
            return action.payload;
        },
        unsetTransferedConversation: () => {
            return initialState;
        },
    },
});

export const { setTransferedConversation, unsetTransferedConversation } = transferedConversation.actions;

export default transferedConversation.reducer;
