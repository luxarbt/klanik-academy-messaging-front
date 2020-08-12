import React, { useContext } from "react";
import { Link } from "react-router-dom";
import UserContext from "../../context/UserContext";
import Sidebar from "../sidebar/Sidebar";
import SidebarLeft from "../sidebar/SidebarLeft";

export default function Home() {
  const { userData } = useContext(UserContext);

  return (
    <div className="page">
      {userData.user ? (
        <>
          <h1>
            Welcome {userData.user.name} {userData.user.surname}
          </h1>
          <Sidebar />
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
