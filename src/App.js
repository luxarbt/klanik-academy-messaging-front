import React, { useState, useEffect } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import io from "socket.io-client";
import Axios from "axios";
import Header from "./components/layout/Header";
import Home from "./components/pages/Home";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import UserContext from "./context/UserContext";
import Conv from "./components/pages/Conv";

import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "./style.css";
import "react-notifications/lib/notifications.css";
import SocketManager from "./services/socketService";

export default function App() {
  const [userData, setUserData] = useState({
    token: undefined,
    user: undefined,
  });

  const socket = io("http://localhost:9000");

  useEffect(() => {
    const socketSingleton = SocketManager.getInstance();
    socketSingleton.setSocket(socket);

    const checkLoggedIn = async () => {
      let token = localStorage.getItem("auth-token");
      if (token === null) {
        localStorage.setItem("auth-token", "");
        token = "";
      }
      const tokenRes = await Axios.post(
        "http://localhost:9000/users/tokenIsValid",
        null,
        { headers: { "x-auth-token": token } }
      );
      if (tokenRes.data) {
        try {
          const userRes = await Axios.get("http://localhost:9000/users/", {
            headers: { "x-auth-token": token },
          });

          setUserData({
            token,
            user: userRes.data,
          });
        } catch (err) {
          console.log(err);
        }
      }
    };

    checkLoggedIn();
  }, []);

  return (
    <>
      <BrowserRouter>
        <div className="App">
          <UserContext.Provider value={{ userData, setUserData }}>
            <Header />
            <div className="auth-wrapper">
              <div className="auth-inner">
                <Switch>
                  <Route exact path="/" component={Home} />
                  <Route path="/login" component={Login} />
                  <Route path="/register" component={Register} />
                  <Route path="/conv" component={Conv} />
                </Switch>
              </div>
            </div>
            <Switch />
          </UserContext.Provider>
        </div>
      </BrowserRouter>
    </>
  );
}
