import React, { useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import Axios from "axios";
import UserContext from "../../context/UserContext";
import ErrorNotice from "../misc/ErrorNotice";

export default function Login() {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [error, setError] = useState();

  const { setUserData } = useContext(UserContext);
  const history = useHistory();

  const submit = async (e) => {
    e.preventDefault();

    try {
      const loginUser = { email, password };
      const loginRes = await Axios.post(
        "http://localhost:9000/users/login",
        loginUser
      );
      setUserData({
        token: loginRes.data.token,
        user: loginRes.data.user,
      });

      if (undefined !== loginRes.data.token) {
        await Axios.get("http://localhost:9000/users/all").then((response) => {
          localStorage.setItem("users", JSON.stringify(response.data));
        });
      }
      localStorage.setItem("auth-token", loginRes.data.token);
      history.push("/");
    } catch (err) {
      setError(err.response.data.msg);
    }
  };

  return (
    <div className="page">
      <h2>Log in</h2>
      {error && (
        <ErrorNotice message={error} clearError={() => setError(undefined)} />
      )}
      <form onSubmit={submit}>
        <div className="form-group">
          <label htmlFor="register-email">
            Email
            <input
              type="email"
              id="register-email"
              className="form-control"
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
        </div>

        <div className="form-group">
          <label htmlFor="register-password">
            Password
            <input
              type="password"
              className="form-control"
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
        </div>
        <input
          type="submit"
          className="btn btn-primary btn-block"
          value="Log in"
        />
      </form>
    </div>
  );
}
