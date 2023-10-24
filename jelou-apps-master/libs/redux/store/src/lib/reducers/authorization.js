import { createSlice } from "@reduxjs/toolkit";

const initialState = false;

export const unauthorized = createSlice({
    name: "unauthorized",
    initialState,
    reducers: {
        setUnauthorization: (state, action) => {
            const payload = action.payload;
            return payload;
        },
    },
});

export const { setUnauthorization } = unauthorized.actions;

export default unauthorized.reducer;
