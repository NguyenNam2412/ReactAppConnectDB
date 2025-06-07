import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  loading: false,
  error: null,
  data: [],
};

const fetchDataSlices = createSlice({
  name: 'fetchData',
  initialState,
  reducers: {
    Start: (state) => {
      state.loading = true;
      state.error = null;
    },
    Success: (state, action) =>{
      state.loading = false;
      state.data = action.payload || [];
    },
    Failure: (state, action) =>{
      state.loading = false;
      state.error = action.payload || 'error';
    },
  },
});

export default fetchDataSlices.reducer;
