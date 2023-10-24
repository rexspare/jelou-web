import { createSlice } from "@reduxjs/toolkit";

const initialState = false;

export const showDraft = createSlice({
    name: "showDraft",
    initialState,
    reducers: {
        setShowDraft: (state, action) => {
            return action.payload;
        },
    },
});

export const { setShowDraft } = showDraft.actions;

export default showDraft.reducer;