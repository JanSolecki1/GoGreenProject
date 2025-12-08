import React, { useState } from "react";
import { supabase } from "../utils/supabase";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [name, setName] = useState("");
  const nav = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();

    // find or create user
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
    <div style={{ padding: 20 }}>
      <h2>Enter username</h2>

      <form onSubmit={handleLogin}>
        <input 
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <button>Continue</button>
      </form>
    </div>
  );
}
