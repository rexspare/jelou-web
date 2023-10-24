import { createSlice } from "@reduxjs/toolkit";

const initialState = false;

export const isLoadingPost = createSlice({
    name: "isLoadingPost",
    initialState,
    reducers: {
        setIsLoadingPost: (state, action) => {
            const payload = action.payload;
            return payload;
        },
    },
});

export const { setIsLoadingPost } = isLoadingPost.actions;

export default isLoadingPost.reducer;
