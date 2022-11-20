import { apiSlice } from "../app/api/apiSlice";

export const calendarApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUnavailableTimePeriods: builder.query({
      query: (dateOfGame) =>
        `${process.env.REACT_APP_READ_UNAVAILABLE_TIME_PERIODS}?dateOfGame=${dateOfGame}`,
      // transformResponse: (responseData) => {
      //   const result = responseData.map(
      //     ({ date_of_game, start_time, end_time }) => {
      //       const date = date_of_game.split("-");
      //       start_time = start_time.split(":");
      //       end_time = end_time.split(":");
      //       return {
      //         start_time_data_array: [
      //           date[0],
      //           date[1] - 1,
      //           date[2],
      //           start_time[0],
      //           start_time[1],
      //         ],
      //         end_time_data_array: [
      //           date[0],
      //           date[1] - 1,
      //           date[2],
      //           end_time[0],
      //           end_time[1],
      //         ],
      //       };
      //     }
      //   );
      //   return result;
      // },
      //   providesTags: (result, error, arg) => [
      //     { type: "UnavailableTimePeriods", id: "LIST" },
      //     ...result.ids.map((id) => ({ type: "Calendar", id })),
      //   ],
    }),
    getBasicDaysSchedules: builder.query({
      query: () => process.env.REACT_APP_READ_BASIC_DAYS_SCHEDULES,
      providesTags: ["BasicDaysSchedule"],
    }),
    updateBasicDaySchedule: builder.mutation({
      query: (basicDayData) => ({
        url: process.env
          .REACT_APP_UPDATE_CERTAIN_DAY_SCHEDULE_AND_SEND_VOUCHERS,
        method: "POST",
        body: { ...basicDayData },
      }),
      invalidatesTags: ["BasicDaysSchedule"],
    }),
    getBlockedDates: builder.query({
      query: () => process.env.REACT_APP_READ_ALTERED_BLOCKED_DATES,
      providesTags: ["BlockedDates"],
    }),
    addBlockedDate: builder.mutation({
      query: (blockedDateData) => ({
        url: process.env.REACT_APP_CREATE_CERTAIN_DATE_SCHEDULE,
        method: "POST",
        body: { ...blockedDateData },
      }),
      invalidatesTags: ["BlockedDates"],
    }),
    deleteBlockedDate: builder.mutation({
      query: (blockedDateData) => ({
        url: process.env.REACT_APP_DELETE_ALTERED_WORK_SCHEDULE,
        method: "POST",
        body: { ...blockedDateData },
      }),
      invalidatesTags: ["BlockedDates"],
    }),
    getTimePeriods: builder.query({
      query: (dateOfGame) =>
        `${process.env.REACT_APP_READ_FILTERED_TIME_PERIODS}?dateOfGame=${dateOfGame}`,
      keepUnusedDataFor: 60,
    }),
  }),
});

export const {
  useGetBlockedDatesQuery,
  useAddBlockedDateMutation,
  useDeleteBlockedDateMutation,
  useGetBasicDaysSchedulesQuery,
  useUpdateBasicDayScheduleMutation,
  useGetUnavailableTimePeriodsQuery,
  useGetTimePeriodsQuery,
} = calendarApiSlice;
