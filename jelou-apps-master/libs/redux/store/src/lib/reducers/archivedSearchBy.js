import { createSlice } from "@reduxjs/toolkit";
const initialState = "";

export const archivedSearchBy = createSlice({
    name: "archivedSearchBy",
    initialState,
    reducers: {
        addSearchBy: (state, action) => {
            const payload = action.payload;
            return payload;
        },
        deleteSearchBy: (state, action) => {
            return initialState;
        },
    },
});

export const { addSearchBy, deleteSearchBy } = archivedSearchBy.actions;

export default archivedSearchBy.reducer;
