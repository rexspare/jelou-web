import { createSlice } from "@reduxjs/toolkit";

const initialState = {};

export const currentEmail = createSlice({
    name: "currentEmail",
    initialState,
    reducers: {
        setCurrentEmail: (state, action) => {
            const payload = action.payload;
            return payload;
        },
        unsetCurrentEmail: () => {
            return initialState;
        },
        updateCurrentEmail: (state, action) => {
            const payload = action.payload;
            const currentEmail = { ...state };
            return { ...currentEmail, ...payload };
        },
    },
});

export const { setCurrentEmail, unsetCurrentEmail, updateCurrentEmail } = currentEmail.actions;

export default currentEmail.reducer;
