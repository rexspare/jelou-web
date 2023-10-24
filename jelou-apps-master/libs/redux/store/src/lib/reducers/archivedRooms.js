import { deleteByIdArchived, mergeById, updateByIdSortByDate } from "@apps/shared/utils";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import compact from "lodash/compact";
import get from "lodash/get";
import { updateCurrentArchivedRoom } from "./currentArchivedRoom";

const initialState = [];

export const updateArchivedRoom = createAsyncThunk("rooms/updateArchivedRoom", async (room, thunkAPI) => {
    const dispatch = thunkAPI.dispatch;
    const { currentArchivedRoom, archivedRooms } = thunkAPI.getState();
    if (get(currentArchivedRoom, "id") === get(room, "id")) {
        dispatch(updateCurrentArchivedRoom(room));
    }
    return compact(updateByIdSortByDate(archivedRooms, room));
});

export const archivedRooms = createSlice({
    name: "archivedRooms",
    initialState,
    reducers: {
        setRoomArchived: (state, action) => {
            const payload = action.payload;
            return payload;
        },
        addRoomsArchived: (state, action) => {
            const payload = action.payload;
            return compact(mergeById(state, payload, "_id"));
        },
        deleteRoomsArchived: (state, action) => {
            return initialState;
        },
        deleteRoomArchived: (state, action) => {
            const roomId = action.payload;
            return compact(deleteByIdArchived(state, roomId));
        },
    },
});

export const { setRoomArchived, addRoomsArchived, deleteRoomsArchived, deleteRoomArchived } = archivedRooms.actions;

export default archivedRooms.reducer;
