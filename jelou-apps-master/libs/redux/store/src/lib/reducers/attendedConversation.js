import { createSlice } from "@reduxjs/toolkit";

const initialState = "--";

export const attendedConversation = createSlice({
    name: "attendedConversation",
    initialState,
    reducers: {
        setAttendedConversation: (state, action) => {
            return action.payload;
        },
        unsetAttendedConversation: () => {
            return initialState;
        },
    },
});

export const { setAttendedConversation, unsetAttendedConversation } = attendedConversation.actions;

export default attendedConversation.reducer;
