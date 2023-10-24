import { createSlice } from "@reduxjs/toolkit";

const initialState = "--";

export const averageReply = createSlice({
    name: "averageReply",
    initialState,
    reducers: {
        setAverageReply: (state, action) => {
            return action.payload;
        },
        unsetAverageReply: () => {
            return initialState;
        },
    },
});

export const { setAverageReply, unsetAverageReply } = averageReply.actions;

export default averageReply.reducer;
