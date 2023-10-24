import { mergeById } from "@apps/shared/utils";
import { createSlice } from "@reduxjs/toolkit";

const initialState = [];

export const answerAIQueue = createSlice({
    name: "answerAIQueue",
    initialState,
    reducers: {
        setAnswerAIQueue: (state, action) => {
            return action.payload ?? [];
        },
        updateAnswerAIQueue: (state, action) => {
            // merge by id
            return mergeById(state, action.payload, "requestId");
        },
    },
});

export const { setAnswerAIQueue, updateAnswerAIQueue } = answerAIQueue.actions;

export default answerAIQueue.reducer;
