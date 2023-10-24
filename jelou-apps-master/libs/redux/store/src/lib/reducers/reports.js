import { createSlice } from "@reduxjs/toolkit";

const initialState = [];

export const reports = createSlice({
    name: "reports",
    initialState,
    reducers: {
        setReports: (state, action) => {
            const payload = action.payload;
            return payload;
        },
    },
});

export const { setReports } = reports.actions;

export default reports.reducer;
