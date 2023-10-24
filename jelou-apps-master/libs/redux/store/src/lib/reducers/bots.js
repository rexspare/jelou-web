import { DashboardServer, JelouApiV1 } from "@apps/shared/modules";
import { mergeById } from "@apps/shared/utils";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import get from "lodash/get";

const initialState = [];

export const getBots = createAsyncThunk("bots/getBots", async (params, thunkAPI) => {
    const { _companyId = "", shouldPaginate = false } = params;

    const { company } = thunkAPI.getState();

    const companyId = _companyId ? _companyId : company.id;

    const { data } = await DashboardServer.get(`/companies/${companyId}/bots/data`, {
        params: {
            shouldPaginate,
        },
    }).catch((error) => {
        console.log(error);
    });
    const results = get(data, "data.results", []);
    return results;
});

export const getBotsByChannel = createAsyncThunk("bots/getBotsByChannel", async (channel, thunkAPI) => {
    const { company } = thunkAPI.getState();
    const { data } = await DashboardServer.get(`/companies/${company.id}/bots/data?channel=${channel.value}`).catch((error) => {
        console.log(error);
    });
    const results = get(data, "data.results", []);
    return results;
});

export const getBotsPma = createAsyncThunk("bots/getBotsPma", async () => {
    const { data } = await JelouApiV1.get(`/bots`).catch((error) => {
        console.log(error);
    });
    return data;
});

export const bots = createSlice({
    name: "bots",
    initialState,
    reducers: {
        updateBot: (state, action) => {
            return mergeById(state, action.payload);
        },
        deleteBots: () => {
            return initialState;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(getBots.fulfilled, (state, action) => {
            return action.payload;
        });
        builder.addCase(getBotsPma.fulfilled, (state, action) => {
            return action.payload;
        });
        builder.addCase(getBotsByChannel.fulfilled, (state, action) => {
            return action.payload;
        });
    },
});

export const { deleteBots, updateBot } = bots.actions;

export default bots.reducer;
