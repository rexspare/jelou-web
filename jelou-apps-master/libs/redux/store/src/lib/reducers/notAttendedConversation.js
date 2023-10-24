import { createSlice } from "@reduxjs/toolkit";

const initialState = "--";

export const notAttendedConversation = createSlice({
    name: "notAttendedConversation",
    initialState,
    reducers: {
        setNotAttendedConversation: (state, action) => {
            return action.payload;
        },
        unsetNotAttendedConversation: () => {
            return initialState;
        },
    },
});

export const { setNotAttendedConversation, unsetNotAttendedConversation } = notAttendedConversation.actions;

export default notAttendedConversation.reducer;
