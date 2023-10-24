import { mergeById } from "@apps/shared/utils";
import { createSlice } from "@reduxjs/toolkit";
import compact from "lodash/compact";

const initialState = [];

export const inputMessages = createSlice({
    name: "inputMessages",
    initialState,
    reducers: {
        setInputMessage: (state, action) => {
            const payload = action.payload;
            return compact(mergeById(state, payload, "roomId"));
        },
    },
});

export const { setInputMessage } = inputMessages.actions;

export default inputMessages.reducer;
