import React, { useState } from "react";
import { supabase } from "../utils/supabase";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [name, setName] = useState("");
  const nav = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();

    const { data: existing } = await supabase
      .from("users")
      .select("*")
      .eq("name", name)
      .maybeSingle();

    let userId;

    if (existing) {
      userId = existing.id;
    } else {
      const { data: newUser } = await supabase
        .from("users")
        .insert({ name })
        .select()
        .single();

      userId = newUser.id;
    }

    localStorage.setItem("user_id", userId);
    nav("/words");
  }

  return (
    <div className="page center">
      <div className="card" style={{ width: "100%", maxWidth: 360 }}>
        
        <h2 style={{ marginBottom: 12 }}>Welcome</h2>
        <p style={{ textAlign: "center", marginBottom: 16 }}>
          Enter your name to start learning Danish vocabulary.
        </p>

        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          
          <input
            className="input"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <button className="btn btn-primary" type="submit">
            Continue
          </button>

        </form>
      </div>
    </div>
  );
}
