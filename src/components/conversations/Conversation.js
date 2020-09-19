import React, { useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { ChatFeed, Message } from "react-chat-ui";
import Axios from "axios";
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";
import UserContext from "../../context/UserContext";
import SocketManager from "../../services/socketService";

export default function Conversation({ userRequested }) {
  const { userData } = useContext(UserContext);
  const [message, setMessage] = useState();
  const [messages, setMessages] = useState([]);

  const socketSingleton = SocketManager.getInstance();
  const socket = socketSingleton.getSocket();

  useEffect(() => {
    const getMessages = async () => {
      Axios.get("http://localhost:9000/messages/get", {
        params: {
          conversation: userRequested.conversationId,
        },
      }).then((response) => {
        response.data.map(async (msg) => {
          const sender = await Axios.get("http://localhost:9000/users/user", {
            params: { user: msg.sender },
          });
          setMessages((arrayMessages) => [
            ...arrayMessages,
            new Message({
              id: msg.sender === userData.user._id ? 0 : "",
              message: msg.message,
              senderName: `${sender.data.name} ${sender.data.surname}`,
            }),
          ]);
        });
      });
    };
    getMessages();
    socket.on("GetMessages", async (data) => {
      try {
        const lastMessage = await Axios.get(
          "http://localhost:9000/messages/get-last-message",
          {
            params: {
              conversation: userRequested.conversationId,
            },
          }
        );
        const sender = await Axios.get("http://localhost:9000/users/user", {
          params: { user: lastMessage.data[0].sender },
        });
        NotificationManager.info(
          `New message from : ${sender.data.name} ${sender.data.surname} : ${lastMessage.data[0].message}`
        );
      } catch (err) {
        console.log(err);
      }
      setMessages([]);
      data.map(async (msg) => {
        const sender = await Axios.get("http://localhost:9000/users/user", {
          params: { user: msg.sender },
        });
        return setMessages((arrayMessages) => [
          ...arrayMessages,
          new Message({
            id: msg.sender === userData.user._id ? 0 : "",
            message: msg.message,
            senderName: `${sender.data.name} ${sender.data.surname}`,
          }),
        ]);
      });
    });
  }, [socket, userData.user._id, userRequested.conversationId]);

  const onMessageSubmit = async (e) => {
    e.preventDefault();
    const newMessage = {
      sender: userData.user._id,
      receiver: userRequested._id,
      message,
      conversation: userRequested.conversationId,
    };
    await Axios.post("http://localhost:9000/messages/send", newMessage);
    socket.emit("newMessage", {
      message,
      conversation: userRequested.conversationId,
    });
    setMessages((arrayMessages) => [
      ...arrayMessages,
      new Message({
        id: 0,
        message,
        senderName: `${userData.user.name} ${userData.user.surname}`,
      }),
    ]);
  };

  const handleChange = (e) => {
    setMessage(e.target.value);
  };

  return (
    <div className="chatfeed-wrapper">
      <NotificationContainer />
      <ChatFeed
        maxHeight={250}
        messages={messages} // Boolean: list of message objects
        showSenderName
      />

      <form onSubmit={(e) => onMessageSubmit(e)}>
        <input
          name="send-message"
          onChange={handleChange}
          placeholder="Type a message..."
          className="message-input"
        />
      </form>
    </div>
  );
}

Conversation.propTypes = {
  userRequested: PropTypes.instanceOf(Object),
};

Conversation.defaultProps = {
  userRequested: {},
};
