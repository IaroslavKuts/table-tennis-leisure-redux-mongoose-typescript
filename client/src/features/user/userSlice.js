import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";

const userAdapter = createEntityAdapter({
  selectId: (user) => user.user_id,
});

const initialState = userAdapter.getInitialState();

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUser: builder.query({
      query: () => process.env.REACT_APP_READ_USER,
      transformResponse: (responseData) => {
        return userAdapter.setOne(initialState, responseData);
      },
      providesTags: (result, error, arg) => {
        console.log(result, error, arg);
        return [
          { type: "User", id: "LIST" },
          ...result.ids.map((id) => ({ type: "User", id })),
        ];
      },
    }),
    updateUserData: builder.mutation({
      query: (userData) => ({
        url: process.env.REACT_APP_UPDATE_USER_DATA,
        method: "POST",
        body: { ...userData },
      }),
      invalidatesTags: (result, error, arg) => {
        return [{ type: "User", id: arg.user_id }];
      },
    }),
  }),
});

export const { useGetUserQuery, useUpdateUserDataMutation } = userApiSlice;

export const selectUserResult = userApiSlice.endpoints.getUser.select();

const selectUserData = createSelector(selectUserResult, (user) => user.data);

export const { selectAll: selectUser } = userAdapter.getSelectors(
  (state) => selectUserData(state) ?? initialState
);
