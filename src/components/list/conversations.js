import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import Axios from "axios";
import UserContext from "../../context/UserContext";

export default function Conversations() {
  const { userData } = useContext(UserContext);

  const [users, setUsers] = useState([]);

  const apiCall = async () => {
    Axios.get("http://localhost:9000/chat/requestget", {
      params: { userRequested: userData },
    }).then((response) => {
      const array = [];
      response.data.map(async (request) => {
        try {
          const usersRequesting = await Axios.get(
            "http://localhost:9000/users/user",
            {
              params: { user: request.userRequesting },
            }
          );
          usersRequesting.data.status = request.status;
          usersRequesting.data.requestId = request._id;
          array.push(usersRequesting);
          setUsers([array]);
          return usersRequesting;
        } catch (err) {
          return console.log(err);
        }
      });
    });
  };

  useEffect(() => {
    apiCall();
  }, [userData]);

  return (
    <div>
      <p>Conversations : </p>
      <p>
        {users[0]
          ? users[0]
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
