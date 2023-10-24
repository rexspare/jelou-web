import { createSlice } from "@reduxjs/toolkit";

const initialState = {};

export const currentCompany = createSlice({
    name: "currentCompany",
    initialState,
    reducers: {
        setCurrentCompany: (state, action) => {
            const payload = action.payload;
            return payload;
        },
        unsetCurrentCompany: (state, action) => {
            return initialState;
        },
    },
});

export const { setCurrentCompany, unsetCurrentCompany } = currentCompany.actions;

export default currentCompany.reducer;
