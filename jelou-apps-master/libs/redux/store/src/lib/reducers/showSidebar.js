import { createSlice } from "@reduxjs/toolkit";

const initialState = true;

export const showSidebar = createSlice({
    name: "showSidebar",
    initialState,
    reducers: {
        setShowSidebar: (state, action) => {
            return action.payload;
        },
    },
});

export const { setShowSidebar } = showSidebar.actions;

export default showSidebar.reducer;
