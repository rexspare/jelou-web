import { createSlice } from "@reduxjs/toolkit";

const initialState = 0;

const pmaNotifications = createSlice({
    name: "pmaNotifications",
    initialState,
    reducers: {
        setChatNotification(state, action) {
            return action.payload;
        },
        addChatNotification: (state, action) => {
            return state + 1;
        },
        removeChatNotification: (state, action) => {
            return state - 1;
        },
    },
});

export const { setChatNotification, addChatNotification, removeChatNotification } = pmaNotifications.actions;

export default pmaNotifications.reducer;
