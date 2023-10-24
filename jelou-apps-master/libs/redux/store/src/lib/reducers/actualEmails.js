import { createSlice } from "@reduxjs/toolkit";

const initialState = 0;

export const actualEmails = createSlice({
    name: "actualEmails",
    initialState,
    reducers: {
        setActualEmails: (state, action) => {
            return action.payload;
        },
    },
});

export const { setActualEmails } = actualEmails.actions;

export default actualEmails.reducer;
