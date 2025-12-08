// src/components/NavBar.jsx
import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { supabase } from "../utils/supabase";

export default function NavBar() {
  const loc = useLocation();
  const nav = useNavigate();

  async function logout() {
    await supabase.auth.signOut();
    nav("/login");
  }

  return (
    <nav style={{ padding: 8, borderBottom: "1px solid #ccc" }}>
      <Link to="/">Splash</Link> |{" "}
      <Link to="/words">Words</Link> |{" "}
      <Link to="/game">Game</Link> |{" "}
      <Link to="/progress">Progress</Link> |{" "}
      <Link to="/settings">Settings</Link> |{" "}
      <button onClick={logout} style={{ fontSize: 12 }}>Logout</button>

      <div style={{ fontSize: 12, marginTop: 6 }}>
        Current: {loc.pathname}
      </div>
    </nav>
  );
}
