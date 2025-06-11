import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';

import authConstants from '../../store/constants/authConstants';
import authLogin from '../../store/selectors/authSelectors';

function LoginPage() {
  const dispatch = useDispatch();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const data = useSelector(authLogin.selectAuth)
  const loading = useSelector(authLogin.selectAuthLoading);
  const error = useSelector(authLogin.selectAuthLoading);
  const LoginSuccess = useSelector(authLogin.selectUser);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    dispatch({ 
      type: authConstants.LOGIN_REQUEST,
      payload: { 
        username: username,
        password: password,
      }
    });
  };

  useEffect(() => {
    if (!!LoginSuccess) {
      localStorage.setItem("token", data.token);
      navigate("/");
    }
  }, [LoginSuccess, data, navigate])

  return (
    <div className="login-container">
      <h2>Login</h2>
      {error && <div className="error">{error}</div>}
      {loading && <p>Loading...</p>}
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default LoginPage;
