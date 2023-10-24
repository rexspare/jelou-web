import { createSlice } from "@reduxjs/toolkit";

const initialState = {};

export const operatorSelected = createSlice({
    name: "operatorSelected",
    initialState,
    reducers: {
        getOperator: (state, action) => {
            return action.payload;
        },
        updateOperatorSelected: (state, action) => {
            return action.payload;
        },
        setOperatorSelected: (state, action) => {
            return action.payload;
        },
        deleteOperatorSelected: () => {
            return initialState;
        },
    },
});

export const { getOperator, updateOperatorSelected, setOperatorSelected, deleteOperatorSelected } = operatorSelected.actions;

export default operatorSelected.reducer;
