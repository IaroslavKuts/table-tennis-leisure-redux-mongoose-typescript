import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";

const personAdapter = createEntityAdapter({
  selectId: (person) => person.user_id,
});

const initialState = personAdapter.getInitialState();

export const personApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPerson: builder.query({
      query: () => process.env.REACT_APP_READ_PERSON,
      transformResponse: (responseData) =>
        personAdapter.setOne(initialState, responseData),
      providesTags: (result, error, arg) => {
        return [
          { type: "Person", id: "LIST" },
          ...result.ids.map((id) => ({ type: "Person", id })),
        ];
      },
    }),
    updatePerson: builder.mutation({
      query: (personalData) => ({
        url: process.env.REACT_APP_UPDATE_PERSON,
        method: "POST",
        body: { ...personalData },
      }),
      invalidatesTags: (result, error, arg) => {
        return [{ type: "Person", id: arg.user_id }];
      },
    }),
  }),
});

export const { useGetPersonQuery, useUpdatePersonMutation } = personApiSlice;

export const selectPersonResult = personApiSlice.endpoints.getPerson.select();

const selectPersonData = createSelector(
  selectPersonResult,
  (person) => person.data
);

export const { selectAll: selectPerson } = personAdapter.getSelectors(
  (state) => selectPersonData(state) ?? initialState
);
