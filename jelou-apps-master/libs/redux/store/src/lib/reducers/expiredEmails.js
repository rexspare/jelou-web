import { createSlice } from "@reduxjs/toolkit";

const initialState = 0;

export const expiredEmails = createSlice({
    name: "expiredEmails",
    initialState,
    reducers: {
        setExpiredEmails: (state, action) => {
            return action.payload;
        },
    },
});

export const { setExpiredEmails } = expiredEmails.actions;

export default expiredEmails.reducer;
