import { createSlice } from "@reduxjs/toolkit";

const initialState = {};

export const currentArchivedRoom = createSlice({
    name: "currentArchivedRoom",
    initialState,
    reducers: {
        setCurrentArchivedRoom: (state, action) => {
            const payload = action.payload;
            return payload;
        },
        unsetCurrentArchivedRoom: () => {
            return initialState;
        },
        updateCurrentArchivedRoom: (state, action) => {
            const payload = action.payload;
            const currentRoom = { ...state };
            return { ...currentRoom, ...payload };
        },
    },
});

export const { setCurrentArchivedRoom, unsetCurrentArchivedRoom, updateCurrentArchivedRoom } = currentArchivedRoom.actions;

export default currentArchivedRoom.reducer;
