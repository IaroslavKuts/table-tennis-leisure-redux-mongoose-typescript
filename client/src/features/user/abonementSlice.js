import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";
const abonementsAdapter = createEntityAdapter({
  selectId: (abonement) => abonement.id_abonement,
  sortComparer: (a, b) => a.id_abonement - b.id_abonement,
});

const initialState = abonementsAdapter.getInitialState();

export const abonementsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllAbonements: builder.query({
      query: () => process.env.REACT_APP_READ_ALL_ABONEMENTS,
      transformResponse: (responseData) =>
        abonementsAdapter.setAll(initialState, responseData),
      providesTags: (result, error, arg) => [
        { type: "Abonements", id: "LIST" },
        ...result.ids.map((id) => ({ type: "Abonements", id })),
      ],
    }),
    addAbonement: builder.mutation({
      query: (abonementData) => ({
        url: process.env.REACT_APP_CREATE_ABONEMENT,
        method: "POST",
        body: { ...abonementData },
      }),
      invalidatesTags: [{ type: "Abonements", id: "LIST" }],
    }),
  }),
});

export const { useGetAllAbonementsQuery, useAddAbonementMutation } =
  abonementsApiSlice;

export const selectAllAbonementsResult =
  abonementsApiSlice.endpoints.getAllAbonements.select();

const selectAllAbonementsData = createSelector(
  selectAllAbonementsResult,
  (abonements) => abonements.data
);

export const {
  selectAll: selectAllAbonements,
  selectById: selectAbonementById,
} = abonementsAdapter.getSelectors(
  (state) => selectAllAbonementsData(state) ?? initialState
);
