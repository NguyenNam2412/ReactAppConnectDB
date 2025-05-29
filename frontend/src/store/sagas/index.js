import { all } from 'redux-saga/effects';
import fetchDataSagas from './fetchDataSagas';

export default function* rootSaga() {
  yield all([fetchDataSagas()]);
}
