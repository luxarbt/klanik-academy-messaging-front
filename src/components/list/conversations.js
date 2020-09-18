import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import Axios from "axios";
import UserContext from "../../context/UserContext";

export default function Conversations() {
  const { userData } = useContext(UserContext);

  const [users, setUsers] = useState([]);

  useEffect(() => {
    const apiCall = async () => {
      Axios.get("http://localhost:9000/conversation/all").then((response) => {
        response.data.map(async (conversation) => {
          if (conversation.firstUser === userData.user._id) {
            try {
              const user = await Axios.get("http://localhost:9000/users/user", {
                params: { user: conversation.secondUser },
              });
              user.data.conversationId = conversation._id;
              try {
                const lastMessage = await Axios.get(
                  "http://localhost:9000/messages/get-last-message",
                  {
                    params: {
                      conversation: user.data.conversationId,
                    },
                  }
                );
                user.data.lastMessage = lastMessage.data[0].message;
              } catch (err) {
                console.log(err);
              }
              setUsers((arrayUser) => [...arrayUser, user]);
            } catch (err) {
              console.log(err);
            }
          } else if (conversation.secondUser === userData.user._id) {
            try {
              const user = await Axios.get("http://localhost:9000/users/user", {
                params: { user: conversation.firstUser },
              });
              user.data.conversationId = conversation._id;
              try {
                const lastMessage = await Axios.get(
                  "http://localhost:9000/messages/get-last-message",
                  {
                    params: {
                      conversation: user.data.conversationId,
                    },
                  }
                );
                user.data.lastMessage = lastMessage.data[0].message;
              } catch (err) {
                console.log(err);
              }
              setUsers((arrayUser) => [...arrayUser, user]);
            } catch (err) {
              console.log(err);
            }
          }
        });
      });
    };
    apiCall();
  }, [userData.user._id]);

  return (
    <div>
      <p>Conversations : </p>
      <p>
        {users
          ? users.map((user) => (
              <>
                <Link to={{ pathname: "/conv", state: user.data }}>
                  {user.data.name} {user.data.surname}
                </Link>
                <p>{user.data.lastMessage}</p>
              </>
            ))
          : ""}
      </p>
    </div>
  );
}
