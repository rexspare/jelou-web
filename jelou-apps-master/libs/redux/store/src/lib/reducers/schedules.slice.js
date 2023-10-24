import { createSlice } from '@reduxjs/toolkit';
import { mergeById } from '@apps/shared/utils';

const initialState = [];

export const schedules = createSlice({
  name: 'schedules',
  initialState,
  reducers: {
    setSchedulesList: (state, action) => {
      const descending = action.payload.sort(function (a, b) {
        const date1 = new Date(a.createdAt);
        const date2 = new Date(b.createdAt);
        return date2 - date1;
      });
      return descending;
    },
    addMoreSchedules: (state, action) => {
      const scheduleUpdated = [...state, ...action.payload];
      const descending = scheduleUpdated.sort(function (a, b) {
        const date1 = new Date(a.createdAt);
        const date2 = new Date(b.createdAt);
        return date2 - date1;
      });
      return descending;
    },
    updateSchedule: (state, action) => {
      const scheduleUpdated = mergeById(state, action.payload);
      const descending = scheduleUpdated.sort(function (a, b) {
        const date1 = new Date(a.createdAt);
        const date2 = new Date(b.createdAt);
        return date2 - date1;
      });
      return descending;
    },
    deleteScheduleFromList: (state, action) => {
      const filteredSchedules = state.filter(
        (schedule) => schedule.id !== action.payload
      );
      return filteredSchedules;
    },
  },
});

export const {
  setSchedulesList,
  addMoreSchedules,
  updateSchedule,
  addNewSchedule,
  deleteScheduleFromList,
} = schedules.actions;

export default schedules.reducer;
