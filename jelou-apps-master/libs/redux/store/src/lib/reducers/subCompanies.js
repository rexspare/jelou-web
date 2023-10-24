import { createSlice } from "@reduxjs/toolkit";

const initialState = {};

export const subCompanies = createSlice({
    name: "subCompanies",
    initialState,
    reducers: {
        setSubCompanies: (state, action) => {
            const payload = action.payload;
            return payload;
        },
    },
});

export const { setSubCompanies } = subCompanies.actions;

export default subCompanies.reducer;
