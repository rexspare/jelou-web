import { createSlice } from "@reduxjs/toolkit";

const initialState = false;

export const pusherIsConnected = createSlice({
    name: "PusherIsConnected",
    initialState,
    reducers: {
        setPusherIsConnected: (state, action) => {
            return action.payload;
        },
    },
});

export const { setPusherIsConnected } = pusherIsConnected.actions;

export default pusherIsConnected.reducer;
