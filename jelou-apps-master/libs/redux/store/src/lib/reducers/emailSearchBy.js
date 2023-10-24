import { createSlice } from "@reduxjs/toolkit";

const initialState = "";

export const emailSearchBy = createSlice({
    name: "emailSearchBy",
    initialState,
    reducers: {
        addEmailSearchBy: (state, action) => {
            return action.payload;
        },
        deleteEmailSearchBy: () => {
            return initialState;
        },
    },
});

export const { addEmailSearchBy, deleteEmailSearchBy } = emailSearchBy.actions;

export default emailSearchBy.reducer;
