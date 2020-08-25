import React, { useContext } from "react";
import PropTypes from "prop-types";
import UserContext from "../../context/UserContext";

export default function Conversation({ userRequested }) {
  console.log(userRequested);
  const { userData } = useContext(UserContext);
  console.log(userData);
  return (
    <div id="chat">
      <label htmlFor="message">
        <input
          type="text"
          name="message"
          id="message"
          placeholder="Votre message..."
          size="50"
        />
      </label>
      <input type="submit" id="send_message" value="Send" />
    </div>
  );
}

Conversation.propTypes = {
  userRequested: PropTypes.instanceOf(Object),
};

Conversation.defaultProps = {
  userRequested: {},
};
