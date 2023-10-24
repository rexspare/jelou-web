import { createSlice } from "@reduxjs/toolkit";

const initialState = {};

export const channel = createSlice({
    name: "channel",
    initialState,
    reducers: {
        setChannel: (state, action) => {
            return action.payload;
        },
    },
});

export const { setChannel } = channel.actions;

export default channel.reducer;