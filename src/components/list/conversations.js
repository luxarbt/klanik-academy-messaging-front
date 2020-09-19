import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import Axios from "axios";
import UserContext from "../../context/UserContext";
import SocketManager from "../../services/socketService";

export default function Conversations() {
  const { userData } = useContext(UserContext);

  const [users, setUsers] = useState([]);
  const [lastMsg, setLastMsg] = useState();

  const socketSingleton = SocketManager.getInstance();
  const socket = socketSingleton.getSocket();

  const getLastMessage = async (conversation) => {
    try {
      const lastMessage = await Axios.get(
        "http://localhost:9000/messages/get-last-message",
        {
          params: {
            conversation: conversation._id,
          },
        }
      );
      setLastMsg(lastMessage.data[0].message);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const getAllConversations = async () => {
      Axios.get("http://localhost:9000/conversation/all").then((response) => {
        response.data.map(async (conversation) => {
          getLastMessage(conversation);
          socket.on("GetMessages", async () => {
            getLastMessage(conversation);
          });
          if (conversation.firstUser === userData.user._id) {
            try {
              const user = await Axios.get("http://localhost:9000/users/user", {
                params: { user: conversation.secondUser },
              });
              setUsers((arrayUser) => [...arrayUser, user]);
            } catch (err) {
              console.log(err);
            }
          } else if (conversation.secondUser === userData.user._id) {
            try {
              const user = await Axios.get("http://localhost:9000/users/user", {
                params: { user: conversation.firstUser },
              });
              setUsers((arrayUser) => [...arrayUser, user]);
            } catch (err) {
              console.log(err);
            }
          }
        });
      });
    };
    getAllConversations();
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
              </>
            ))
          : ""}
        <p>
          <b>{lastMsg}</b>
        </p>
      </p>
    </div>
  );
}
