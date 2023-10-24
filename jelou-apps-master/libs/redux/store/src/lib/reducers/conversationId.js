import { createSlice } from "@reduxjs/toolkit";

const initialState = false;

export const conversationId = createSlice({
    name: "conversationId",
    initialState,
    reducers: {
        setConversationId: (state, action) => {
            const payload = action.payload;
            return payload;
        },
    },
});

export const { setConversationId } = conversationId.actions;

export default conversationId.reducer;
