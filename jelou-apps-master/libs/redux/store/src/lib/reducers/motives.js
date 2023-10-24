import get from "lodash/get";
import { DashboardServer } from "@apps/shared/modules";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = [];

export const setMotives = createAsyncThunk("dynamic/events", async (type, thunkAPI) => {
    const { company } = thunkAPI.getState();
    const companyId = get(company, "id", "");
    const { data } = await DashboardServer.get(`/dynamic_events/company/${companyId}`, {
        params: {
            type: type,
        },
        signal: thunkAPI.signal,
    }).catch((error) => {
        console.log(error);
    });
    const results = get(data, "data.results", []);
    return results;
});

export const motives = createSlice({
    name: "motives",
    initialState,
    extraReducers: (builder) => {
        builder.addCase(setMotives.fulfilled, (state, action) => {
            return action.payload;
        });
    },
});

export default motives.reducer;
