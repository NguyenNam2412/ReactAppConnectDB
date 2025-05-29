import { combineReducers } from '@reduxjs/toolkit';
import fetchDataReducers from './fetchDataReducers.js';

const rootReducer = combineReducers({
  fetchData: fetchDataReducers,
});

export default rootReducer;
