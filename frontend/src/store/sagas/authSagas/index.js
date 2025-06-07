// src/store/sagas/authSaga.js
import { call, put, takeLatest } from "redux-saga/effects";
import { loginRequest, loginSuccess, loginFailure } from "../slices/authSlice";
import { loginRequest as loginApi } from "../../api/authApi";

function* handleLogin(action) {
  try {
    const response = yield call(loginApi, action.payload);
    yield put(loginSuccess(response.data));
  } catch (error) {
    yield put(loginFailure(error.response?.data?.error || "Login failed"));
  }
}

export default function* authSaga() {
  yield takeLatest(loginRequest.type, handleLogin);
}
