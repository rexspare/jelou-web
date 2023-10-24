import { createSlice } from "@reduxjs/toolkit";

const initialState = {};

const filters = createSlice({
    name: "filters",
    initialState,
    reducers: {
        setFilters: (state, action) => {
            return { ...state, ...action.payload };
        },
    },
});

export const { setFilters } = filters.actions;
export default filters.reducer;
