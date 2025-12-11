import React from "react";
import { useNavigate } from "react-router-dom";

export default function NavBar() {
  const logout = () => {
    localStorage.removeItem("user_id");
    window.location.href = "/login";
  };

  return (
    <nav className="navbar">
      <button className="logout-btn" onClick={logout}>Logout</button>
    </nav>
  );
}

