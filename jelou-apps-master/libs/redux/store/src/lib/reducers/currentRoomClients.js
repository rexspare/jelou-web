import { createSlice } from "@reduxjs/toolkit";
const initialState = {};

export const currentRoomClients = createSlice({
    name: "currentRoomClients",
    initialState,
    reducers: {
        setCurrentRoomClients: (state, action) => {
            const payload = action.payload;
            return payload;
        },
        unsetCurrentRoomClients: () => {
            return initialState;
        },
    },
});

export const { setCurrentRoomClients, unsetCurrentRoomClients } = currentRoomClients.actions;

export default currentRoomClients.reducer;
