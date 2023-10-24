import { createSlice } from "@reduxjs/toolkit";

import concat from "lodash/concat";
import compact from "lodash/compact";
import { deleteById, mergeById } from "@apps/shared/utils";

const initialState = [];

export const generalConversations = createSlice({
    name: "generalConversations",
    initialState,
    reducers: {
        getGeneralConversations: (state, action) => {
            const payload = action.payload;
            return payload;
        },
        setGeneralConversations: (state, action) => {
            return action.payload;
        },
        updateGeneralConversations: (state, action) => {
            return concat(mergeById(state, [action.payload]));
        },
        deleteGeneralConversations: (state, action) => {
            const roomId = action.payload;
            return compact(deleteById(state, roomId));
        },
    },
});

export const { getGeneralConversations, setGeneralConversations, updateGeneralConversations, deleteGeneralConversations } =
    generalConversations.actions;

export default generalConversations.reducer;
