import { createSlice } from "@reduxjs/toolkit";

const initialState = false;

export const showTesterChat = createSlice({
    name: "showTesterChat",
    initialState,
    reducers: {
        setShowTesterChat: (state, action) => {
            return action.payload;
        },
    },
});

export const { setShowTesterChat } = showTesterChat.actions;

export default showTesterChat.reducer;