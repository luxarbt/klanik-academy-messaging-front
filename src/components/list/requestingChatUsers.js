import React, { useState, useEffect, useContext } from "react";
import Axios from "axios";
import UserContext from "../../context/UserContext";

export default function RequestingChatUsers() {
  const { userData } = useContext(UserContext);

  const [users, setUsers] = useState([]);
  const [requestChat, setRequestChat] = useState();

  const apiCall = async () => {
    Axios.get("http://localhost:9000/chat/requestget", {
      params: { userRequested: userData },
    }).then((response) => {
      setRequestChat(response.data);
      response.data.map(async (request) => {
        try {
          const usersRequesting = await Axios.get(
            "http://localhost:9000/users/user",
            {
              params: { user: request.userRequesting },
            }
          );
          setUsers([usersRequesting]);
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

  const sendChatUpdate = async () => {
    try {
      const acceptChatRequest = {
        chatRequestId: requestChat[0]._id,
        status: "accepted",
      };
      await Axios.put(
        "http://localhost:9000/chat/updaterequest",
        acceptChatRequest
      );

      // TODO : Send notification
    } catch (err) {
      console.log(err);
    }
  };

  const sendChatUpdateDecline = async () => {
    try {
      const declineChatRequest = {
        chatRequestId: requestChat[0]._id,
        status: "declined",
      };
      await Axios.put(
        "http://localhost:9000/chat/updaterequest",
        declineChatRequest
      );

      // TODO : Send notification
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      Requêtes de chat reçues :
      <p>
        {users.map((user) => (
          <>
            {user.data.name} {user.data.surname}
            <input
              type="button"
              className="btn btn-primary btn-block"
              value="Accept"
              onClick={sendChatUpdate}
            />
            <input
              type="button"
              className="btn btn-primary btn-block"
              value="Decline"
              onClick={sendChatUpdateDecline}
            />
          </>
        ))}
      </p>
    </div>
  );
}
