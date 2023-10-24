import { updateById } from "@apps/shared/utils";
import { createSlice } from "@reduxjs/toolkit";
import compact from "lodash/compact";

const initialState = {};

export const currentPost = createSlice({
    name: "currentPost",
    initialState,
    reducers: {
        setCurrentPost: (state, action) => {
            const payload = action.payload;
            return payload;
        },
        unsetCurrentPost: () => {
            return initialState;
        },
        updateCurrentPost: (state, action) => {
            return { ...action.payload };
        },
    },
});

export const { setCurrentPost, unsetCurrentPost, updateCurrentPost } = currentPost.actions;

export default currentPost.reducer;
