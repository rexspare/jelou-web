import { createSlice } from "@reduxjs/toolkit";
import get from "lodash/get";

const initialState = get(localStorage, "campaignNotSeen", true);

export const campaignNotSeen = createSlice({
    name: "campaignNotSeen",
    initialState,
    reducers: {
        setCampaignNotSeen: (state, action) => {
            const payload = action.payload;
            return payload;
        },
    },
});

export const { setCampaignNotSeen } = campaignNotSeen.actions;

export default campaignNotSeen.reducer;
