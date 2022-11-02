import { apiSlice } from "../../app/api/apiSlice";

export const createReportApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProfit: builder.query({
      query: ({ start_date, end_date }) =>
        `${process.env.REACT_APP_READ_PROFIT}?start_date=${start_date}&end_date=${end_date}`,
      //   providesTags: ["BasicDaysSchedule"],
    }),
    getDaysLoad: builder.query({
      query: ({ start_date, end_date }) =>
        `${process.env.REACT_APP_READ_DAYS_LOAD}?start_date=${start_date}&end_date=${end_date}`,
      //   providesTags: ["BasicDaysSchedule"],
    }),
    getProfitByUsers: builder.query({
      query: ({ start_date, end_date }) =>
        `${process.env.REACT_APP_READ_USERS_DATA_BY_PAYMENT}?start_date=${start_date}&end_date=${end_date}`,
      //   providesTags: ["BasicDaysSchedule"],
    }),
    getUsersAges: builder.query({
      query: () => process.env.REACT_APP_READ_CUSTOMERS_AGES,
      //   providesTags: ["BasicDaysSchedule"],
    }),
    getUsersAbonements: builder.query({
      query: () => process.env.REACT_APP_READ_CUSTOMERS_ABONEMENTS,
      //   providesTags: ["BasicDaysSchedule"],
    }),
    getUserOrdersByPassport: builder.query({
      query: (passport) =>
        `${process.env.REACT_APP_READ_USER_ORDERS_BY_PASSPORT}?passport=${passport}`,
      //   providesTags: ["BasicDaysSchedule"],
    }),
  }),
});

export const {
  useGetProfitQuery,
  useGetDaysLoadQuery,
  useGetProfitByUsersQuery,
  useGetUsersAgesQuery,
  useGetUsersAbonementsQuery,
  useGetUserOrdersByPassportQuery,
} = createReportApiSlice;
