const selectAuth = (state) => {
  return state.auth
};
const selectUser = (state) => {
  return state.auth.user
};
const selectAuthLoading = (state) => {
  return state.auth.loading
};
const selectAuthError = (state) => {
  return state.auth.error
};

const authLogin = {
  selectAuth,
  selectUser,
  selectAuthLoading,
  selectAuthError,
}

export default authLogin;

