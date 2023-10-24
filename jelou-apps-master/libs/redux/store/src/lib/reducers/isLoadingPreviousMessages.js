import { createSlice } from "@reduxjs/toolkit";

const initialState = false;

export const isLoadingPreviousMessages = createSlice({
    name: "isLoadingPreviousMessages",
    initialState,
    reducers: {
        loadingMessages: (state, action) => {
            const payload = action.payload;
            return payload;
        },
    },
});

export const { loadingMessages } = isLoadingPreviousMessages.actions;

export default isLoadingPreviousMessages.reducer;
