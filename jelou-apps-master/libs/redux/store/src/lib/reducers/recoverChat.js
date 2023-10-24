import { createSlice } from "@reduxjs/toolkit";

const initialState = {};

export const recoverChat = createSlice({
    name: "recoverChat",
    initialState,
    reducers: {
        setRecoverChat: (state, action) => {
            const payload = action.payload;
            return !payload;
        },
    },
});

export const { setRecoverChat } = recoverChat.actions;

export default recoverChat.reducer;
