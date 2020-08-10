import React, { useState, useEffect, useContext } from "react";
import Axios from "axios";
import UserContext from "../../context/UserContext";

export default function RequestingChatUsers() {
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

  const sendChatUpdate = async (e) => {
    try {
      const acceptChatRequest = {
        chatRequestId: e.target.dataset.id,
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

  const sendChatUpdateDecline = async (e) => {
    try {
      const declineChatRequest = {
        chatRequestId: e.target.dataset.id,
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
      Chat requests received :
      <p>
        {users[0]
          ? users[0]
              .filter((user) => user.data.status === "pending")
              .map((user) => (
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
              ))
          : ""}
      </p>
    </div>
  );
}
