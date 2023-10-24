import { mergeById } from "@apps/shared/utils";
import { createSlice } from "@reduxjs/toolkit";
// import DashboardServer from "../modules/DashboardServer";
// import isEmpty from "lodash/isEmpty";
// import axios from "axios";
const initialState = [];

export const clientsRooms = createSlice({
    name: "clientsRooms",
    initialState,
    reducers: {
        addClientsRooms: (state, action) => {
            const payload = action.payload;
            return payload;
        },
        addMoreClientsRooms: (state, action) => {
            return state.push(action.payload);
        },
        unsetClientsRooms: (state, action) => {
            return initialState;
        },
        updateClientsRooms: (state, action) => {
            let rooms = [...state];
            rooms = mergeById(rooms, action.payload);
            return rooms;
        },
    },
});

export const { addClientsRooms, addMoreClientsRooms, unsetClientsRooms, updateClientsRooms } = clientsRooms.actions;

export default clientsRooms.reducer;
