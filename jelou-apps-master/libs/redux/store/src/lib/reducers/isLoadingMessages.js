import { createSlice } from "@reduxjs/toolkit";

const initialState = false;

export const isLoadingMessages = createSlice({
    name: "isLoadingMessages",
    initialState,
    reducers: {
        setIsLoadingMessages: (state, action) => {
            const payload = action.payload;
            return payload;
        },
    },
});

export const { setIsLoadingMessages } = isLoadingMessages.actions;

export default isLoadingMessages.reducer;
