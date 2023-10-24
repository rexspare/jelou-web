import { createSlice } from '@reduxjs/toolkit';

const initialState = [];

export const clients = createSlice({
  name: 'clients',
  initialState,
  reducers: {
    addClients: (state, action) => {
      const payload = action.payload;
      return payload;
    },
    resetClients: (state, action) => {
      return initialState;
    },
  },
});

export const { addClients, resetClients } = clients.actions;

export default clients.reducer;
