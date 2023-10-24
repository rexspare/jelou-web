import { createSlice } from "@reduxjs/toolkit";

const initialState = false;

export const isLoadingForwardMessages = createSlice({
    name: "isLoadingForwardMessages",
    initialState,
    reducers: {
        loadingForwardMessages: (state, action) => {
            const payload = action.payload;
            return payload;
        },
    },
});

export const { loadingForwardMessages } = isLoadingForwardMessages.actions;

export default isLoadingForwardMessages.reducer;
