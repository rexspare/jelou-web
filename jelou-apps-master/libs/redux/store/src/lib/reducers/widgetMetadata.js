import { createSlice } from "@reduxjs/toolkit";

const initialState = {};

export const widgetMetadata = createSlice({
    name: "widgetMetadata",
    initialState,
    reducers: {
        saveData: (state, action) => {
            return action.payload;
        },
    },
});

export const { saveData } = widgetMetadata.actions;

export default widgetMetadata.reducer;
