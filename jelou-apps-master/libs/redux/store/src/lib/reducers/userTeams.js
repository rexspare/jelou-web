import { createSlice } from "@reduxjs/toolkit";

const initialState = [];

export const userTeams = createSlice({
    name: "userTeams",
    initialState,
    reducers: {
        addUserTeams: (state, action) => {
            return action.payload;
        },
    },
});
export const { addUserTeams } = userTeams.actions;

export default userTeams.reducer;
