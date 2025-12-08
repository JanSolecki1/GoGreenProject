import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function NavBar() {
  const nav = useNavigate();
  const userId = localStorage.getItem("user_id");

  function logout() {
    localStorage.removeItem("user_id");
    nav("/login");
  }

  return (
    <nav style={{ padding: 12, borderBottom: "1px solid #ddd" }}>
      <Link to="/">Home</Link> |
      {userId && (
        <>
          <Link to="/words"> Daily Words</Link> |
          <Link to="/game"> Games</Link> |
          <Link to="/progress"> Progress</Link> |
          <Link to="/settings"> Settings</Link> |
          <button onClick={logout}>Logout</button>
        </>
      )}
    </nav>
  );
}
