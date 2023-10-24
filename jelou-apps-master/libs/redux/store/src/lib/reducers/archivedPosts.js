import { createSlice } from "@reduxjs/toolkit";
const initialState = [];
import compact from "lodash/compact";
import { mergeById } from "@apps/shared/utils";

export const archivedPosts = createSlice({
    name: "archivedPosts",
    initialState,
    reducers: {
        addArchivedPosts: (state, action) => {
            return compact(mergeById(state, action.payload));
        },
        addArchivedPost: (state, action) => {
            return compact(mergeById(state, action.payload, "_id"));
        },
        deleteArchivedPost: (state, action) => {
            return initialState;
        },
        deleteArchivedPosts: (state, action) => {
            let rooms = state.push(action.payload);
            return rooms;
        },
    },
});

export const { addArchivedPosts, addArchivedPost, deleteArchivedPost, deleteArchivedPosts } = archivedPosts.actions;

export default archivedPosts.reducer;
