import { createSlice } from "@reduxjs/toolkit";

const initialState = null;

export const replyId = createSlice({
    name: "replyId",
    initialState,
    reducers: {
        setReplyId: (state, action) => {
            return action.payload;
        },
        removeReplyId: (state, action) => {
            return initialState;
        },
    },
});

export const { setReplyId, removeReplyId } = replyId.actions;

export default replyId.reducer;
