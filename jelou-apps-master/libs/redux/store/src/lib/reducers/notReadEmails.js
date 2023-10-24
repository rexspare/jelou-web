import { createSlice } from "@reduxjs/toolkit";
const initialState = 0;

export const notReadEmails = createSlice({
    name: "notReadEmails",
    initialState,
    reducers: {
        setNotReadEmails: (state = initialState, action) => {
            const { operation, value } = action.payload;
            if (operation.toUpperCase() === "ADD") {
                return state + value;
            } else {
                return state - value;
            }
        },
    },
});

export const { setNotReadEmails } = notReadEmails.actions;

export default notReadEmails.reducer;
