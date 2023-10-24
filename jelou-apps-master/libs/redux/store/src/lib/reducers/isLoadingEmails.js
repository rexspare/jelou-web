import { createSlice } from "@reduxjs/toolkit";

const initialState = false;

export const isLoadingEmails = createSlice({
    name: "isLoadingEmails",
    initialState,
    reducers: {
        setIsLoadingEmails: (state, action) => {
            const payload = action.payload;
            return payload;
        },
    },
});

export const { setIsLoadingEmails } = isLoadingEmails.actions;

export default isLoadingEmails.reducer;
