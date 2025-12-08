// src/pages/Login.jsx
import React, { useState, useEffect } from "react";
import { supabase } from "../utils/supabase";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const nav = useNavigate();

  // if already logged in, go to /words
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data?.user) {
        nav("/words");
      }
    });
  }, [nav]);

  async function handleLogin(e) {
    e.preventDefault();

    const { error } = await supabase.auth.signInWithOtp({
      email,
        options: {
  emailRedirectTo: `${window.location.origin}/`,
}
    });

    if (error) {
      alert(error.message);
      return;
    }

    setSent(true);
  }

  if (sent) {
    return (
      <div style={{ padding: 20 }}>
        <h2>Check your email</h2>
        <p>Please click the magic link to sign in.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Login</h2>

      <form onSubmit={handleLogin}>
        <label>Email</label><br />
        <input
          type="email"
          value={email}
          required
          onChange={(e) => setEmail(e.target.value)}
          style={{ marginBottom: 12 }}
        /><br />

        <button type="submit">Send Magic Link</button>
      </form>
    </div>
  );
}
