import { createSlice } from "@reduxjs/toolkit";

const initialState = [];

export const dashboards = createSlice({
    name: "dashboards",
    initialState,
    reducers: {
        setDashboards: (state, action) => {
            const payload = action.payload;
            return payload;
        },
    },
});

export const { setDashboards } = dashboards.actions;

export default dashboards.reducer;
