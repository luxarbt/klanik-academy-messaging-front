/* eslint-disable import/prefer-default-export */
import React, { useContext, useState, useEffect } from "react";
import Axios from "axios";
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
        let previouslocalstorage =
          localStorage.getItem("userRequestedId") !== null
            ? localStorage.getItem("userRequestedId")
            : localStorage.setItem("userRequestedId", []);

        previouslocalstorage = previouslocalstorage.getItem("userRequestedId");
        console.log(previouslocalstorage)
        const netlcoal = JSON.stringify({ id: response.data._id });
        previouslocalstorage.push(netlcoal);
        localStorage.setItem("userRequestedId", previouslocalstorage);
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
