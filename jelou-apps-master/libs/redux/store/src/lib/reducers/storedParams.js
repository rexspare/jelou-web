import { createSlice } from "@reduxjs/toolkit";

const initialState = {};

export const storedParams = createSlice({
    name: "storedParams",
    initialState,
    reducers: {
        setStoredParams: (state, action) => {
            const payload = action.payload;
            return payload;
        },
        unsetStoredParams: () => {
            return initialState;
        },
        updateStoredParams: (state, action) => {
            const payload = action.payload;
            return { ...state, ...payload };
        },
    },
});

export const { setStoredParams, unsetStoredParams, updateStoredParams } = storedParams.actions;

export default storedParams.reducer;
