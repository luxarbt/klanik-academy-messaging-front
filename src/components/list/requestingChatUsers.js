import React, { useState, useEffect, useContext } from "react";
import Axios from "axios";
import UserContext from "../../context/UserContext";

export default function RequestingChatUsers() {
  const { userData } = useContext(UserContext);

  const [users, setUsers] = useState([]);
  const [requestChatDisplay, setRequestChatDisplay] = useState([]);

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
          usersRequesting.data.requestId = request._id;
          setUsers((arrayUsers) => [...arrayUsers, usersRequesting]);
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

  const sendChatUpdate = async (e) => {
    const chatRequestId = e.target.dataset.id;
    try {
      const acceptChatRequest = {
        chatRequestId: chatRequestId,
        status: "accepted",
      };
      await Axios.put(
        "http://localhost:9000/chat/updaterequest",
        acceptChatRequest
      );
      setRequestChatDisplay((arrayRequestChat) => [
        ...arrayRequestChat,
        chatRequestId,
      ]);

      // TODO : Send notification
    } catch (err) {
      console.log(err);
    }
  };

  const sendChatUpdateDecline = async (e) => {
    const chatRequestId = e.target.dataset.id;
    try {
      const declineChatRequest = {
        chatRequestId: chatRequestId,
        status: "declined",
      };
      await Axios.put(
        "http://localhost:9000/chat/updaterequest",
        declineChatRequest
      );
      setRequestChatDisplay((arrayRequestChat) => [
        ...arrayRequestChat,
        chatRequestId,
      ]);

      // TODO : Send notification
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      Chat requests received :
      {users
        ? users
            .filter((user) => user.data.status === "pending")
            .map((user) => (
              <p
                style={{
                  display:
                    requestChatDisplay.indexOf(user.data.requestId) !== -1
                      ? "none"
                      : "block",
                }}
              >
                <>
                  {user.data.name} {user.data.surname}
                  <input
                    type="button"
                    className="btn btn-primary btn-block"
                    data-id={user.data.requestId}
                    value="Accept"
                    onClick={sendChatUpdate}
                  />
                  <input
                    type="button"
                    className="btn btn-primary btn-block"
                    data-id={user.data.requestId}
                    value="Decline"
                    onClick={sendChatUpdateDecline}
                  />
                </>
              </p>
            ))
        : ""}
    </div>
  );
}
