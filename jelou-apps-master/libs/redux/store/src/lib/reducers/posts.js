import { createAsyncThunk, createSlice, current } from "@reduxjs/toolkit";
const initialState = [];
import compact from "lodash/compact";
import { deleteById, mergeById, updateById } from "@apps/shared/utils";
import { unsetCurrentPost } from "./currentPost";
import { removeRoomMessages } from "./messages";

export const deletePost = createAsyncThunk("posts/deletePost", async (postId, thunkAPI) => {
    const dispatch = thunkAPI.dispatch;
    const { currentPost, posts } = thunkAPI.getState();
    dispatch(removeRoomMessages(postId));

    if (currentPost?.id === postId) {
        dispatch(unsetCurrentPost());
    }
    return compact(deleteById(posts, postId));
});

export const posts = createSlice({
    name: "posts",
    initialState,
    reducers: {
        addPosts: (state, action) => {
            return compact(mergeById(current(state), action.payload));
        },
        addPost: (state, action) => {
            return compact(mergeById(current(state), [action.payload], "_id"));
        },

        updatePost: (state, action) => {
            return compact(updateById(current(state), action.payload, "_id"));
        },
        deletePosts: (state, action) => {
            return initialState;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(deletePost.fulfilled, (state, action) => {
            return action.payload;
        });
    },
});

export const { addPosts, addPost, updatePost, _deleted, deletePosts } = posts.actions;

export default posts.reducer;
