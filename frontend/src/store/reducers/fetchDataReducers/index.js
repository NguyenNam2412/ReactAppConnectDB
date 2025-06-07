import { createReducer } from "@reduxjs/toolkit";
import fetchDataActions from "../../actions/fetchData/fetchDataActions";

const initialState = {
  loading: false,
  error: null,
  data: [],
};

const fetchDataReducers = createReducer(initialState, (builder) => {
  builder
    .addCase(fetchDataActions.fetchDataStart, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(fetchDataActions.fetchDataSuccess, (state, action) => {
      state.loading = false;
      state.data = action.payload || [];
    })
    .addCase(fetchDataActions.fetchDataFailure, (state, action) => {
      state.loading = false;
      state.error = action.payload || "error";
    });
});

export default fetchDataReducers;
