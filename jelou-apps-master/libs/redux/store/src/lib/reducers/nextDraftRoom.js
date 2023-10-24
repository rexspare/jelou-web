import { createSlice } from "@reduxjs/toolkit";

const initialState = {};

export const nextDraftRoom = createSlice({
    name: "nextDraftRoom",
    initialState,
    reducers: {
        setNextDraftRoom: (state, action) => {
            return action.payload;
        },
    },
});

export const { setNextDraftRoom } = nextDraftRoom.actions;

export default nextDraftRoom.reducer;