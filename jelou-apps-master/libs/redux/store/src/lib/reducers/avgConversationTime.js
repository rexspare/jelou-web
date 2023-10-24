import { createSlice } from "@reduxjs/toolkit";

const initialState = "--";

export const avgConversationTime = createSlice({
    name: "avgConversationTime",
    initialState,
    reducers: {
        setAvgConversationTime: (state, action) => {
            return action.payload;
        },
    },
});

export const { setAvgConversationTime } = avgConversationTime.actions;

export default avgConversationTime.reducer;
