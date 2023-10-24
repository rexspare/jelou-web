import { createSlice } from "@reduxjs/toolkit";
import { mergeById } from "@apps/shared/utils";
const initialState = [];

export const archivedMessages = createSlice({
    name: "archivedMessages",
    initialState,
    reducers: {
        addArchivedMessages: (state, action) => {
            return mergeById(state, action.payload, "_id");
        },
        addArchivedMessage: (state, action) => {
            return mergeById(state, action.payload, "_id");
        },
        setArchivedMessage: (state, action) => {
            return action.payload;
        },
    },
});

export const { addArchivedMessages, addArchivedMessage, setArchivedMessage } = archivedMessages.actions;

export default archivedMessages.reducer;
