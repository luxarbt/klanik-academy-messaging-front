import React, { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import UserContext from "../../context/UserContext";
import Sidebar from "../sidebar/Sidebar";
import SidebarLeft from "../sidebar/SidebarLeft";
import Conversation from "../conversations/Conversation";

export default function Conv() {
  const { userData } = useContext(UserContext);

  const location = useLocation();

  return (
    <div>
      {userData.user ? (
        <>
          <Sidebar />
          <Conversation userRequested={location.state} />
          <SidebarLeft />
        </>
      ) : (
        <>
          <h2>You are not logged in</h2>
          <Link to="/login">Log in</Link>
        </>
      )}
    </div>
  );
}
