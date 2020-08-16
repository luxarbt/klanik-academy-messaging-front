import React, { useContext } from "react";
import UserContext from "../../context/UserContext";

export default function Conversation({userRequested}) {
  const { userData } = useContext(UserContext);

  console.log(userData.user);

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
