import { createSlice } from "@reduxjs/toolkit";

const initialState = false;

export const isLoadingFirstMessage = createSlice({
    name: "isLoadingFirstMessage",
    initialState,
    reducers: {
        setIsLoadingFirstMessage: (state, action) => {
            const payload = action.payload;
            return payload;
        },
    },
});

export const { setIsLoadingFirstMessage } = isLoadingFirstMessage.actions;

export default isLoadingFirstMessage.reducer;
