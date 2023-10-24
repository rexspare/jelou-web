import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { DashboardServer } from "@apps/shared/modules";
import get from "lodash/get";

const initialState = [];

export const getTeams = createAsyncThunk("teams/getTeams", async (companyId) => {
    const { data } = await DashboardServer.get(`/companies/${companyId}/teams`);
    const results = get(data, "data", []);
    console.log(results, "results from Redux");

    return results;
});

export const teams = createSlice({
    name: "teams",
    initialState,
    reducers: {
        addTeams: (state, action) => {
            return action.payload;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(getTeams.fulfilled, (state, action) => {
            return action.payload;
        });
    },
});
export const { addTeams } = teams.actions;

export default teams.reducer;
