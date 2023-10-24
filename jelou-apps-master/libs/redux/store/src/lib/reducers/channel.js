import { createSlice } from "@reduxjs/toolkit";

import uniq from "lodash/uniq";
import map from "lodash/map";

const initialState = [];

export const channel = createSlice({
    name: "channel",
    initialState,
    reducers: {
        setChannels: (state, action) => {
            const payload = action.payload;
            const unique = uniq(map(payload, "type"));
            const channels = unique.map((channel, index) => {
                return { id: index, name: channel, value: index.toString() };
            });
            return channels;
        },
    },
});

export const { setChannels } = channel.actions;

export default channel.reducer;
