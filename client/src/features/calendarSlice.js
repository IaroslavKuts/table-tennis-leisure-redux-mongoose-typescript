import { createSlice } from "@reduxjs/toolkit";

const calendarSlice = createSlice({
  name: "calendar",
  initialState: { unavailableTimePeriods: [], filteredTimePeriods: null },
  reducers: {
    setUnavailableTimePeriods: (state, action) => {
      const { unavailableTimePeriods } = action.payload;
      state.unavailableTimePeriods = unavailableTimePeriods;
    },
    setFilteredTimePeriods: (state, action) => {
      const { filteredTimePeriods } = action.payload;
      state.filteredTimePeriods ??= filteredTimePeriods;
    },
  },
});

export const { setUnavailableTimePeriods, setFilteredTimePeriods } =
  calendarSlice.actions;

export const selectUnavailableTimePeriods = (state) =>
  state.unavailableTimePeriods;
export const selectFilteredTimePeriods = (state) => state.filteredTimePeriods;

export default calendarSlice.reducer;
