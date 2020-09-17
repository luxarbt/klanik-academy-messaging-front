import React, { useState, useEffect, useContext } from "react";
import Axios from "axios";
import Filter from "./filter";
import Users from "./users";
import UserContext from "../../context/UserContext";
import ChatRequestManager from "../../services/chatRequestService";

export default function Search() {
  const [word, setWord] = useState("");
  const [users, setUsers] = useState([]);

  const { userData } = useContext(UserContext);
  const currentUser = userData.user || "";

  useEffect(() => {
    const chatRequestSingleton = ChatRequestManager.getInstance();
    const getUsers = async () => {
      const result = await Axios.get("http://localhost:9000/users/all");
      const resultFiltered = result.data.filter(
        (user) =>
          user._id !== currentUser._id &&
          !chatRequestSingleton.getChatRequests().includes(user._id)
      );
      setUsers(resultFiltered);
    };

    getUsers();
  }, [currentUser._id]);
  const [filterDisplay, setFilterDisplay] = useState([]);

  const handleChange = (e) => {
    setWord(e);
    const oldList = users.map((user) => {
      return {
        name: user.name.toLowerCase(),
        surname: user.surname.toLowerCase(),
      };
    });

    if (word !== "") {
      let newList = [];

      newList = oldList.filter(
        (user) =>
          user.name.includes(word.toLowerCase()) ||
          user.surname.includes(word.toLowerCase())
      );

      setFilterDisplay(newList);
    } else {
      setFilterDisplay(users);
    }
  };

  return (
    <div>
      <Filter value={word} handleChange={(e) => handleChange(e.target.value)} />
      <Users users={word.length < 1 ? users : filterDisplay} />
    </div>
  );
}
