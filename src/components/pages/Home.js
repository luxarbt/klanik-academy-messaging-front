import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import UserContext from "../../context/UserContext";
import Search from "../search/search";
import RequestingChatUsers from "../list/requestingChatUsers";

export default function Home() {
  const { userData } = useContext(UserContext);

  return (
    <div className="page">
      {userData.user ? (
        <>
          <h1>
            Welcome {userData.user.name} {userData.user.surname}
          </h1>
        </>
      ) : (
        <>
          <h2>You are not logged in</h2>
          <Link to="/login">Log in</Link>
        </>
      )}

      <Search />
      <RequestingChatUsers />
    </div>
  );
}
