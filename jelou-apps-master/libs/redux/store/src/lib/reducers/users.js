import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { DashboardServer } from "@apps/shared/modules";
import get from "lodash/get";

const initialState = [];

export const getUsers = createAsyncThunk("users/getUsers", async (companyId) => {
    const { data } = await DashboardServer.get(`/companies/${companyId}/users`).catch((err) => {
        console.log(err);
    });
    let results = get(data, "data", []);
    results = results.filter((result) => result.state);
    return results;
});

export const users = createSlice({
    name: "users",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getUsers.fulfilled, (state, action) => {
            return action.payload;
        });
    },
});

export default users.reducer;
