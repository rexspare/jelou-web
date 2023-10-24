import { createSlice } from "@reduxjs/toolkit";

const initialState = [];

export const permissions = createSlice({
    name: "permissions",
    initialState,
    reducers: {
        setPermissions: (state, action) => {
            const payload = action.payload;
            return payload;
        },
    },
});

export const { setPermissions } = permissions.actions;

export default permissions.reducer;
