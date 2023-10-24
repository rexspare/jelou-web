import { createSlice } from "@reduxjs/toolkit";

const initialState = false;

export const sessionStorage = createSlice({
    name: "sessionStorage",
    initialState,
    reducers: {
        setSessionStorage: (state, action) => {
            const payload = action.payload;
            return payload;
        },
    },
});

export const { setSessionStorage } = sessionStorage.actions;

export default sessionStorage.reducer;
