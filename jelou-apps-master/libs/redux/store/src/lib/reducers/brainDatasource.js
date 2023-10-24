import { createSlice } from "@reduxjs/toolkit";

const initialState = {};

export const datasource = createSlice({
    name: "datasource",
    initialState,
    reducers: {
        setDatasource: (state, action) => {
            return action.payload;
        },
    },
});

export const { setDatasource } = datasource.actions;

export default datasource.reducer;