import React, { useState } from "react";
import { supabase } from "../utils/supabase";
import { useNavigate } from "react-router-dom";
import LogoHeader from "../components/LogoHeader";


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
    <>
  <LogoHeader />

  <div className="page center" style={{ paddingTop: 90 }}>
    <div className="card" style={{ width: "100%", maxWidth: 360 }}>
      <h2 style={{ marginBottom: 12 }}>Create your username</h2>
      <p style={{ textAlign: "center", marginBottom: 16 }}>
        This name will be used to log you into the app.
      </p>

      <form 
        onSubmit={handleLogin} 
        style={{ display: "flex", flexDirection: "column", gap: 12 }}
      >
        <input
          className="input"
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          maxLength={21}
        />

        <button className="btn btn-primary" type="submit">
          Continue
        </button>
      </form>
    </div>
  </div>
</>

  );
}