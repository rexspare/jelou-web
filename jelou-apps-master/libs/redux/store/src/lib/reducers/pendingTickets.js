import { createSlice } from "@reduxjs/toolkit";
import { deleteById, mergeByIdOrder } from "@apps/shared/utils";

const initialState = [];

export const pendingTickets = createSlice({
    name: "pendingTickets",
    initialState,
    reducers: {
        setPendingTickets: (state, action) => {
            return action.payload;
        },
        addNewOnePendingTicket: (state, action) => {
            return mergeByIdOrder(state, action.payload, "_id", "number", "desc");
        },
        deleteOnePendingTicket: (state, action) => {
            return deleteById(state, action.payload, "_id");
        },
    },
});

export const { setPendingTickets, addNewOnePendingTicket, deleteOnePendingTicket } = pendingTickets.actions;

export default pendingTickets.reducer;
