import { createSlice } from "@reduxjs/toolkit";

const initialState = false;

export const isLoadingPostSidebar = createSlice({
    name: "isLoadingPostSidebar",
    initialState,
    reducers: {
        setIsLoadingPostSidebar: (state, action) => {
            const payload = action.payload;
            return payload;
        },
    },
});

export const { setIsLoadingPostSidebar } = isLoadingPostSidebar.actions;

export default isLoadingPostSidebar.reducer;
