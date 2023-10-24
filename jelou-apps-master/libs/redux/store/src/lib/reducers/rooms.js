import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import compact from "lodash/compact";
import get from "lodash/get";
import toUpper from "lodash/toUpper";
import { mergeById, updateById, updateByIdSortByDate } from "@apps/shared/utils";
import { removeRoomMessages, setMessages } from "./messages";
import { unsetCurrentRoom, updateCurrentRoom } from "./currentRoom";
import { JelouApiV1 } from "@apps/shared/modules";
import { showMobileChat } from "./showChat";

const initialState = [];

export const setRooms = createAsyncThunk("rooms/setRooms", (rooms, thunkAPI) => {
    const dispatch = thunkAPI.dispatch;
    const messages = compact(rooms.map((room) => room.messages).flat());
    dispatch(setMessages(messages));
    return [...rooms];
});

export const deleteRoom = createAsyncThunk("rooms/deleteRoom", (roomId, thunkAPI) => {
    const dispatch = thunkAPI.dispatch;
    const { currentRoom, rooms } = thunkAPI.getState();
    dispatch(removeRoomMessages(roomId));

    console.log(`deleteRoom ~ rooms/deleteRoom -> currentRoomId: ${currentRoom?.id} - roomId: ${roomId}`);

    if (currentRoom?.id === roomId) {
        dispatch(showMobileChat(false));
        dispatch(unsetCurrentRoom());
    }

    return rooms.filter((room) => room.id !== roomId);
});

export const updateRoom = createAsyncThunk("rooms/updateRoom", (room, thunkAPI) => {
    const dispatch = thunkAPI.dispatch;
    const { currentRoom, rooms } = thunkAPI.getState();
    if (get(currentRoom, "id", "") === get(room, "id")) {
        dispatch(updateCurrentRoom(room));
    }
    return compact(updateByIdSortByDate(rooms, room));
});

export const addRoom = createAsyncThunk("rooms/addRoom", async (room, thunkAPI) => {
    const dispatch = thunkAPI.dispatch;
    const { rooms } = thunkAPI.getState();
    console.log("rooms", rooms);
    if (toUpper(room.type) === "CLIENT") {
        try {
            const { data: response } = await JelouApiV1.get(`bots/${room.appId}/rooms/${room.id}/conversation`);
            room.conversation = get(response, "data.Conversation", null);
            room.storedParams = get(response, "data.StoredParams", null);
            room.tags = get(response, "data.Room.tags", []);
            dispatch(updateRoom(room));
        } catch (error) {
            console.log(error, "error");
        }
    }
    return compact(mergeById(rooms, [room]));
});

export const rooms = createSlice({
    name: "rooms",
    initialState,
    reducers: {
        addRooms: (state, action) => {
            const payload = action.payload;
            return mergeById(state, payload);
        },
        addMoreRooms: (state, action) => {
            let rooms = state.push(action.payload);
            return rooms;
        },
        unsetRooms: (state, action) => {
            return initialState;
        },
        updateRooms: (state, action) => {
            let rooms = state.push(action.payload);

            return rooms;
        },
        updateRoomById: (state, action) => {
            return compact(updateById(state, action.payload));
        },
    },
    extraReducers: (builder) => {
        builder.addCase(setRooms.fulfilled, (state, action) => {
            return action.payload;
        });
        builder.addCase(deleteRoom.fulfilled, (state, action) => {
            return action.payload;
        });
        builder.addCase(updateRoom.fulfilled, (state, action) => {
            return action.payload;
        });
        builder.addCase(addRoom.fulfilled, (state, action) => {
            return action.payload;
        });
    },
});

export const { addRooms, addMoreRooms, unsetRooms, updateRooms, updateRoomById } = rooms.actions;

export default rooms.reducer;
