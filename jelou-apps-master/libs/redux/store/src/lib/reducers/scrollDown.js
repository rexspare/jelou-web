import { createSlice } from '@reduxjs/toolkit';

const initialState = true;

export const scrollDown = createSlice({
  name: 'scrollDown',
  initialState,
  reducers: {
    isScrollingDown: (state, action) => {
      return action.payload;
    },
  },
});

export const { isScrollingDown } = scrollDown.actions;

export default scrollDown.reducer;
