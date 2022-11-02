import { apiSlice } from "../../app/api/apiSlice";

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: process.env.REACT_APP_LOGIN,
        method: "POST",
        headers: { "x-xsrf-token": localStorage.getItem("csrf") },
        body: { ...credentials },
      }),
    }),
    getRefreshToken: builder.query({
      query: () => process.env.REACT_APP_REFRESH_TOKEN,
    }),
  }),
});

export const { useLoginMutation, useGetRefreshTokenQuery } = authApiSlice;
