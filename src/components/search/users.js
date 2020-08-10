/* eslint-disable import/prefer-default-export */
import React, { useContext, useState, useEffect } from "react";
import Axios from "axios";
import socket from "socket.io-client";
import UserContext from "../../context/UserContext";

export const Users = ({users}) => {
  const { userData } = useContext(UserContext);

  const currentUser = userData.user || "";

  const sendChatRequest = async (e) => {
    try {
      const newChatRequest = {
        userRequesting: currentUser,
        userRequested: JSON.parse(e.target.dataset.user),
        status: "pending",
      };
      await Axios.post(
        "http://localhost:9000/chat/newrequest",
        newChatRequest
      ).then((response) => {
        socket.connect("http://localhost:8080");
        socket.emit("chat_request", () => {
          console.log("test");
        });
      });

      // TODO : Send notification
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <h3>Users : </h3>
      <ul>
        {users.map((user) =>
          userData.user && userData.user._id !== user._id ? (
            <>
              <li>
                {user.name} {user.surname}
                <input
                  type="button"
                  className="btn btn-primary btn-block"
                  value="Request chat"
                  data-user={JSON.stringify(user)}
                  onClick={sendChatRequest}
                />
              </li>
            </>
          ) : (
            ""
          )
        )}
      </ul>
    </div>
  );
};
