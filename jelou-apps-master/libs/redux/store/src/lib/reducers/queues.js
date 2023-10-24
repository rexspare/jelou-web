import { mergeById, updateById } from "@apps/shared/utils";
import { createSlice, current } from "@reduxjs/toolkit";
import compact from "lodash/compact";
const initialState = [];

export const queues = createSlice({
    name: "queues",
    initialState,
    reducers: {
        addQueues: (state, action) => {
            return compact(mergeById(current(state), action.payload, "_id"));
        },
        addQueue: (state, action) => {
            return compact(mergeById(current(state), [action.payload], "_id"));
        },
        updateQueue: (state, action) => {
            return compact(updateById(current(state), action.payload, "_id"));
        },
        deleteQueue: (state, action) => {
            const newState = current(state);
            return newState.filter((queue) => queue._id !== action.payload);
        },
    },
});

export const { addQueues, addQueue, updateQueue, deleteQueue } = queues.actions;

export default queues.reducer;
