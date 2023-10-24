import { createSlice } from "@reduxjs/toolkit";

const initialState = {};

export const company = createSlice({
    name: "company",
    initialState,
    reducers: {
        setCompany: (state, action) => {
            const payload = action.payload;
            return payload;
        },
        unsetCompany: () => {
            return {};
        },
    },
});

export const { setCompany, unsetCompany } = company.actions;

export default company.reducer;
