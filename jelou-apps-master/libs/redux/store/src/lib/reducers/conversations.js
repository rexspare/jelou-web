import { createSlice } from "@reduxjs/toolkit";

import concat from "lodash/concat";
import compact from "lodash/compact";
import { deleteById, mergeById } from "@apps/shared/utils";

const initialState = [];

export const conversations = createSlice({
    name: "conversations",
    initialState,
    reducers: {
        getConversations: (state, action) => {
            return action.payload;
        },
        setConversations: (state, action) => {
            return action.payload;
        },
        updateConversations: (state, action) => {
            return concat(mergeById(state, [action.payload]));
        },
        deleteConversation: (state, action) => {
            const roomId = action.payload;
            return compact(deleteById(state, roomId));
        },
    },
});

export const { getConversations, setConversations, updateConversations, deleteConversation } = conversations.actions;

export default conversations.reducer;
