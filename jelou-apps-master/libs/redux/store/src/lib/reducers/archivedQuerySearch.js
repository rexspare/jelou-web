import { createSlice } from "@reduxjs/toolkit";

const initialState = "";

export const archivedQuerySearch = createSlice({
    name: "archivedQuerySearch",
    initialState,
    reducers: {
        addQuerySearch: (state, action) => {
            return action.payload;
        },
        deleteQuerySearch: () => {
            return initialState;
        },
    },
});

export const { addQuerySearch, deleteQuerySearch } = archivedQuerySearch.actions;

export default archivedQuerySearch.reducer;
