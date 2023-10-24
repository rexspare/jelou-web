import { createSlice } from "@reduxjs/toolkit";
import { deleteById, mergeById } from "@apps/shared/utils";

const initialState = [];

export const tickets = createSlice({
    name: "tickets",
    initialState,
    reducers: {
        addTickets: (state, action) => {
            const payload = action.payload;
            return payload;
        },
        addTicket: (state, action) => {
            return mergeById(state, action.payload, "_id");
        },
        updateTicket: (state, action) => {
            const payload = action.payload;
            return payload;
        },
        deleteTicket: (state, action) => {
            return deleteById(state, action.payload, "_id");
        },
    },
});

export const { addTickets, addTicket, updateTicket, deleteTicket } = tickets.actions;

export default tickets.reducer;
