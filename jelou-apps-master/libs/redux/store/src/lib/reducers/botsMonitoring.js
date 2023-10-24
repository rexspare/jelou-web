import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { JelouApiV1 } from "@apps/shared/modules";
import get from "lodash/get";

const initialState = [];

export const getBotsMonitoring = createAsyncThunk("botsMonitoring/getBotsMonitoring", async (dataArg, { getState }) => {
    const { company } = getState();
    const id = get(company, "id", {});

    const { data } = await JelouApiV1.get(`/bots`);
    const filteredBots = data.filter((bot) => {
        // if Operator doesn't exist, it's true "by default"
        return bot.companyId === id && get(bot.properties, "operator", true) && bot.state === 1;
    });
    return filteredBots;
});

export const botsMonitoring = createSlice({
    name: "botsMonitoring",
    initialState,
    reducers: {
        deleteBotsMonitoring: (state, action) => {
            return initialState;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(getBotsMonitoring.fulfilled, (state, action) => {
            return action.payload;
        });
    },
});
export const { deleteBotsMonitoring } = botsMonitoring.actions;

export default botsMonitoring.reducer;
