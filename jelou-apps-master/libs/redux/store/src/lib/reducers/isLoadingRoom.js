import { createSlice } from "@reduxjs/toolkit";

const initialState = false;

export const isLoadingRoom = createSlice({
    name: "isLoadingRoom",
    initialState,
    reducers: {
        setIsLoadingRoom: (state, action) => {
            const payload = action.payload;
            return payload;
        },
    },
});

export const { setIsLoadingRoom } = isLoadingRoom.actions;

export default isLoadingRoom.reducer;
