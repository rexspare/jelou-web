import { createSlice } from "@reduxjs/toolkit";

const initialState = {};

export const datastore = createSlice({
    name: "datastore",
    initialState,
    reducers: {
        setDatastore: (state, action) => {
            return action.payload;
        },
        updateDatastore: (state, action) => {
            return {
                ...state,
                ...action.payload,
            };
        },
    },
});

export const { setDatastore, updateDatastore } = datastore.actions;

export default datastore.reducer;
