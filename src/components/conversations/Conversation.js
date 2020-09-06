import React, { useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { ChatFeed, Message } from "react-chat-ui";
import Axios from "axios";
import UserContext from "../../context/UserContext";

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
  }, [userData.user._id, userRequested._id, userRequested.conversationId]);

  const onMessageSubmit = async (e) => {
    e.preventDefault();
    const newMessage = {
      sender: userData.user._id,
      receiver: userRequested._id,
      message,
    };
    Axios.post("http://localhost:9000/messages/send", newMessage);
    setMessages((arrayMessages) => [...arrayMessages, newMessage]);
  };

  const handleChange = (e) => {
    setMessage(e.target.value);
  };

  return (
    <div className="chatfeed-wrapper">
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
