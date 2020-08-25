import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import Axios from "axios";
import ErrorNotice from "../misc/ErrorNotice";

export default function Register() {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [passwordCheck, setPasswordCheck] = useState();
  const [name, setName] = useState();
  const [surname, setSurname] = useState();
  const [error, setError] = useState();

  const history = useHistory();

  const submit = async (e) => {
    e.preventDefault();

    try {
      const newUser = { email, password, passwordCheck, name, surname };
      await Axios.post("http://localhost:9000/users/register", newUser);
      history.push("/");
    } catch (err) {
      setError(err.response.data.msg);
    }
  };

  return (
    <div className="page">
      <h2>Register</h2>
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
        <div className="form-group">
          <label htmlFor="register-check-password">
            Verify password
            <input
              type="password"
              id="register-check-password"
              className="form-control"
              onChange={(e) => setPasswordCheck(e.target.value)}
            />
          </label>
        </div>

        <div className="form-group">
          <label htmlFor="register-name">
            Name
            <input
              type="text"
              id="register-name"
              className="form-control"
              onChange={(e) => setName(e.target.value)}
            />
          </label>
        </div>

        <div className="form-group">
          <label htmlFor="register-surname">
            Surname
            <input
              type="text"
              id="register-surname"
              className="form-control"
              onChange={(e) => setSurname(e.target.value)}
            />
          </label>
        </div>

        <input
          type="submit"
          className="btn btn-primary btn-block"
          value="Register"
        />
      </form>
    </div>
  );
}
