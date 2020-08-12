import React from "react";
import Conversations from "../list/conversations";

export default function SidebarLeft() {
  return (
    <div className="sidenav-left">
      Conversations
      <Conversations />
    </div>
  );
}
