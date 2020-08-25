import React from "react";
import { Link } from "react-router-dom";
import AuthOptions from "../auth/AuthOptions";

export default function Header() {
  return (
    <nav className="navbar navbar-expand-lg navbar-light fixed-top">
      <div className="container">
        <Link to="/">
          <img
            src="https://www.klanik.com/wp-content/uploads/2016/10/logo-klanik.png"
            className="custom-logo"
            alt="Klanik"
            width="129"
            height="27"
          />
        </Link>
        <AuthOptions />
      </div>
    </nav>
  );
}
