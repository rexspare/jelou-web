import { createSlice } from "@reduxjs/toolkit";
import { mergeById } from "@apps/shared/utils";

const initialState = [];

export const totalsByTeam = createSlice({
    name: "totalsByTeam",
    initialState,
    reducers: {
        setTotalsByTeam: (state, action) => {
            return action.payload;
        },
        updateTotalsByTeam: (state, action) => {
            return mergeById(state, action.payload);
        },
    },
});

export const { setTotalsByTeam, updateTotalsByTeam } = totalsByTeam.actions;

export default totalsByTeam.reducer;
