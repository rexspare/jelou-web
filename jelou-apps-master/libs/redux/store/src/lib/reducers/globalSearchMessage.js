import { createSlice } from '@reduxjs/toolkit';

const initialState = false;

export const globalSearchMessage = createSlice({
  name: 'globalSearchMessage',
  initialState,
  reducers: {
    setGlobalSearchMessage: (state, action) => {
      const payload = action.payload;
      return payload;
    },
    unsetGlobalSearchMessage: () => {
      return {};
    },
  },
});

export const { setGlobalSearchMessage, unsetGlobalSearchMessage } =
  globalSearchMessage.actions;

export default globalSearchMessage.reducer;
