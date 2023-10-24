import { createSlice } from "@reduxjs/toolkit";

const initialState = {};

export const teamScopes = createSlice({
    name: "teamScopes",
    initialState,
    reducers: {
        addTeamScopes: (state, action) => {
            return action.payload;
        },
    },
});

export const { addTeamScopes } = teamScopes.actions;

export default teamScopes.reducer;
