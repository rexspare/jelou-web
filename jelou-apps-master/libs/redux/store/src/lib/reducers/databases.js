import { createSlice } from "@reduxjs/toolkit";

const initialState = [];

export const databases = createSlice({
    name: "databases",
    initialState,
    reducers: {
        setDatabases: (state, action) => {
            const payload = action.payload;
            return payload;
        },
        addDatabase: (state, action) => {
            const payload = action.payload;
            return [...state, payload];
        },
    },
});

export const { setDatabases, addDatabase } = databases.actions;

export default databases.reducer;
