import React, { useContext, useState, useEffect } from "react";
import Axios from "axios";
import PropTypes from "prop-types";
import UserContext from "../../context/UserContext";
import ChatRequestManager from "../../services/chatRequestService";

export default function Users({ users }) {
  const { userData } = useContext(UserContext);

  const [displayUser, setDisplayUser] = useState([]);
  const [chatRequests, setChatRequests] = useState([]);
  const [userAlreadyRequesting, setUserAlreadyRequesting] = useState([]);

  const currentUser = userData.user || "";

  const sendChatRequest = async (e) => {
    const user = JSON.parse(e.target.dataset.user);
    try {
      const newChatRequest = {
        userRequesting: currentUser,
        userRequested: user,
        status: "pending",
      };
      await Axios.post("http://localhost:9000/chat/newrequest", newChatRequest);
      setDisplayUser((arrayUser) => [...arrayUser, user._id]);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const getChatRequests = async () => {
      await Axios.get("http://localhost:9000/chat/requests").then(
        (response) => {
          const arrayRequestId = [];
          response.data.map((chatRequest) => {
            if (currentUser._id === chatRequest.userRequested) {
              setUserAlreadyRequesting((arrayUser) => [
                ...arrayUser,
                chatRequest.userRequesting,
              ]);
            }
            return arrayRequestId.push(chatRequest.userRequested);
          });
          setChatRequests(arrayRequestId);
          const chatRequestSingleton = ChatRequestManager.getInstance();
          chatRequestSingleton.setChatRequests(arrayRequestId);
        }
      );
    };
    getChatRequests();
  }, [currentUser._id]);

  return (
    <div>
      <h3>Users : </h3>
      <ul>
        {users
          .filter((user) => !chatRequests.includes(user._id))
          .map((user) =>
            userData.user && userData.user._id !== user._id ? (
              <>
                <li
                  style={{
                    display:
                      displayUser.indexOf(user._id) !== -1 ||
                      userAlreadyRequesting.indexOf(user._id) !== -1
                        ? "none"
                        : "block",
                  }}
                >
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
}

Users.propTypes = {
  users: PropTypes.instanceOf(Array),
};

Users.defaultProps = {
  users: [],
};
