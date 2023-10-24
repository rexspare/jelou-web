import { createSlice } from "@reduxjs/toolkit";

const initialState = false;

export const isLoadingArchivedPostSidebar = createSlice({
    name: "isLoadingArchivedPostSidebar",
    initialState,
    reducers: {
        setIsLoadingArchivedPostSidebar: (state, action) => {
            const payload = action.payload;
            return payload;
        },
    },
});

export const { setIsLoadingArchivedPostSidebar } = isLoadingArchivedPostSidebar.actions;

export default isLoadingArchivedPostSidebar.reducer;
