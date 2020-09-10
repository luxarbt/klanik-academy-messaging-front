import React, { useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { ChatFeed, Message } from "react-chat-ui";
import Axios from "axios";
import io from "socket.io-client";
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";
import UserContext from "../../context/UserContext";

const socket = io("http://localhost:9000");

export default function Conversation({ userRequested }) {
  const { userData } = useContext(UserContext);
  const [message, setMessage] = useState();
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const getMessages = async () => {
      Axios.get("http://localhost:9000/messages/get", {
        params: {
          conversation: userRequested.conversationId,
        },
      }).then((response) => {
        response.data.map(async (msg) => {
          setMessages((arrayMessages) => [
            ...arrayMessages,
            new Message({
              id: msg.sender,
              message: msg.message,
              senderName: msg.sender,
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
        NotificationManager.info(
          `New message from : ${lastMessage.data[0].sender} : ${lastMessage.data[0].message}`
        );
      } catch (err) {
        console.log(err);
      }
      setMessages([]);
      data.map((msg) => {
        return setMessages((arrayMessages) => [
          ...arrayMessages,
          new Message({
            id: msg.sender,
            message: msg.message,
            senderName: msg.sender,
          }),
        ]);
      });
    });
  }, [userRequested.conversationId]);

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
    setMessages((arrayMessages) => [...arrayMessages, newMessage]);
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
