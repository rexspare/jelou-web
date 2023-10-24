import { createSlice } from "@reduxjs/toolkit";

const initialState = "";

export const audio = createSlice({
    name: "audio",
    initialState,
    reducers: {
        setPlayingAudio: (state, action) => {
            return action.payload;
        },
    },
});

export const { setPlayingAudio } = audio.actions;

export default audio.reducer;
