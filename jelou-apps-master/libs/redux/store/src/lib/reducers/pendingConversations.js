import { createSlice } from "@reduxjs/toolkit";
import { mergeById, deleteById } from "@apps/shared/utils";
import compact from "lodash/compact";

const initialState = [];

export const pendingConversations = createSlice({
    name: "pendingConversations",
    initialState,
    reducers: {
        setPendingConversations: (state, action) => {
            return action.payload;
        },
        updatePendingConversations: (state, action) => {
            return mergeById(state, action.payload);
        },
        deletePendingConversations: (state, action) => {
            return compact(deleteById(state, action.payload));
        },
    },
});

export const { getPendingConversations, setPendingConversations, updatePendingConversations, deletePendingConversations } =
    pendingConversations.actions;

export default pendingConversations.reducer;
