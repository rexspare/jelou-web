import { createSlice } from "@reduxjs/toolkit";

const initialState = {};

const filtersHsm = createSlice({
    name: "filtersHsm",
    initialState,
    reducers: {
        setFiltersHsm: (state, action) => {
            return { ...state, ...action.payload };
        },
    },
});

export const { setFiltersHsm } = filtersHsm.actions;
export default filtersHsm.reducer;
