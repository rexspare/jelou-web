import { createSlice } from "@reduxjs/toolkit";

const initialState = false;

export const conversation = createSlice({
    name: "conversation",
    initialState,
    reducers: {
        setConversation: (state, action) => {
            const payload = action.payload;
            return payload;
        },
    },
});

export const { setIsLoadingArchivedPostSidebar } = conversation.actions;

export default conversation.reducer;
