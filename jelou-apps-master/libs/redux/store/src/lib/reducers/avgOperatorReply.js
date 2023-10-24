import { createSlice } from "@reduxjs/toolkit";

const initialState = "--";

export const avgOperatorReply = createSlice({
    name: "avgOperatorReply",
    initialState,
    reducers: {
        setAvgOperatorReply: (state, action) => {
            return action.payload;
        },
        unsetAvgOperatorReply: () => {
            return initialState;
        },
    },
});

export const { setAvgOperatorReply, unsetAvgOperatorReply } = avgOperatorReply.actions;

export default avgOperatorReply.reducer;
