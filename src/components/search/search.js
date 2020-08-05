import React, { useState, useEffect } from "react";
import Axios from "axios";
import { Filter } from "./filter";
import { Users } from "./users";

export default function Search() {
  const [word, setWord] = useState("");
  const [users, setUsers] = useState([]);
  useEffect(() => {
    const getUsers = async () => {
      const result = await Axios.get("http://localhost:9000/users/all");
      setUsers(result.data);
    };

    getUsers();
  }, []);
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
