import { createSlice } from "@reduxjs/toolkit";
import isBoolean from "lodash/isBoolean";

const initialState = false;

export const showChat = createSlice({
    name: "showChat",
    initialState,
    reducers: {
        showMobileChat: (state, action) => {
            if (isBoolean(action.payload)) {
                return action.payload;
            }
            return !state;
        },
    },
});

export const { showMobileChat } = showChat.actions;

export default showChat.reducer;
