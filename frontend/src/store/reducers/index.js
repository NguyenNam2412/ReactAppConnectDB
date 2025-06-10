import { combineReducers } from '@reduxjs/toolkit';
import fetchDataReducers from '../slices/fetchDataSlices';

const rootReducer = combineReducers({
  fetchData: fetchDataReducers,
});

export default rootReducer;
