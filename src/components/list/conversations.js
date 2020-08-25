import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import Axios from "axios";
import UserContext from "../../context/UserContext";

export default function Conversations() {
  const { userData } = useContext(UserContext);

  const [users, setUsers] = useState([]);

  useEffect(() => {
    const apiCall = async () => {
      Axios.get("http://localhost:9000/chat/requestget", {
        params: { userRequested: userData },
      }).then((response) => {
        response.data.map(async (request) => {
          try {
            const usersRequesting = await Axios.get(
              "http://localhost:9000/users/user",
              {
                params: { user: request.userRequesting },
              }
            );
            usersRequesting.data.status = request.status;
            usersRequesting.data.chatRequestId = request._id;
            setUsers((arrayUser) => [...arrayUser, usersRequesting]);
            return usersRequesting;
          } catch (err) {
            return console.log(err);
          }
        });
      });
    };
    apiCall();
  }, [userData]);

  return (
    <div>
      <p>Conversations : </p>
      <p>
        {users
          ? users
              .filter((user) => user.data.status === "accepted")
              .map((user) => (
                <>
                  <Link to={{ pathname: "/conv", state: user.data }}>
                    {user.data.name} {user.data.surname}
                  </Link>
                </>
              ))
          : ""}
      </p>
    </div>
  );
}
