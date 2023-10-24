import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toUpper from "lodash/toUpper";
import isEmpty from "lodash/isEmpty";
import maxBy from "lodash/maxBy";
import { showMobileChat } from "./showChat";

const initialState = {};

export const setCurrentRoomAfterRecover = createAsyncThunk("currentRoom/setCurrentRoomAfterRecover", (id, thunkAPI) => {
    const { rooms } = thunkAPI.getState();
    const dispatch = thunkAPI.dispatch;
    const room = rooms.find((x) => x.id === id);
    const filteredRooms = rooms.filter((room) => toUpper(room.type) === "CLIENT");
    dispatch(showMobileChat(false));

    if (isEmpty(room)) {
        const currentRoom = maxBy(filteredRooms, (room) => room.lastMessageAt);

        if (!currentRoom) {
            dispatch(unsetCurrentRoom());
            return;
        }
    }
    return room;
});

export const currentRoom = createSlice({
    name: "currentRoom",
    initialState,
    reducers: {
        setCurrentRoom: (state, action) => {
            const payload = action.payload;
            return payload;
        },
        unsetCurrentRoom: () => {
            return initialState;
        },
        updateCurrentRoom: (state, action) => {
            const payload = action.payload;
            const currentRoom = { ...state };
            return { ...currentRoom, ...payload };
        },
    },
    extraReducers: (builder) => {
        builder.addCase(setCurrentRoomAfterRecover.fulfilled, (state, action) => {
            return action.payload;
        });
    },
});

export const { setCurrentRoom, unsetCurrentRoom, updateCurrentRoom } = currentRoom.actions;

export default currentRoom.reducer;
