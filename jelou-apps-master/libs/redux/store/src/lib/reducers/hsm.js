import { createSlice } from "@reduxjs/toolkit";
import concat from "lodash/concat";

const initialState = [];

const hsm = createSlice({
    name: "hsm",
    initialState,
    reducers: {
        addHSM: (state, action) => {
            return [...action.payload];
        },
        setHsm: (state, action) => {
            return action.payload;
        },
        deleteHsm: (state, action) => {
            return initialState;
        },
    },
});

export const { addHSM, setHsm, deleteHsm } = hsm.actions;
export default hsm.reducer;
