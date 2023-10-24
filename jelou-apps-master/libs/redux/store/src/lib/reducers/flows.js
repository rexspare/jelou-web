import { createSlice } from "@reduxjs/toolkit";
import concat from "lodash/concat";

const initialState = [];

const flows = createSlice({
    name: "flows",
    initialState,
    reducers: {
        addFlows: (state, action) => {
            return [state, ...action.payload];
        },
        updateFlows: (state, action) => {
            return concat(state, action.payload);
        },
        deleteFlows: (state, action) => {
            return initialState;
        },
    },
});

export const { addFlows, updateFlows, deleteFlows } = flows.actions;
export default flows.reducer;
