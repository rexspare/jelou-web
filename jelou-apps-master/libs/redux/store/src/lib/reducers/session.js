import { createSlice } from "@reduxjs/toolkit";

const initialState = !!localStorage.jwt;

export const session = createSlice({
    name: "session",
    initialState,
    reducers: {
        setSession: (state, action) => {
            return !!localStorage.jwt;
        },
    },
});

export const { setSession } = session.actions;

export default session.reducer;
