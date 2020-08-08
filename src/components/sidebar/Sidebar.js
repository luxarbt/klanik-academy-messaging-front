import React from "react";
import Search from "../search/search";
import RequestingChatUsers from "../list/requestingChatUsers";

export default function Sidebar() {
  return (
    <div className="sidenav">
      <Search />
      <RequestingChatUsers />
    </div>
  );
}
