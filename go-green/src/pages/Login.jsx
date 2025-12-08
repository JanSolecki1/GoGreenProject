import React, { useState } from "react";
import { supabase } from "../utils/supabase";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const nav = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: "http://localhost:5173/words" }
    });

    if (error) {
      alert(error.message);
      return;
    }

    setSent(true);
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Login</h2>

      {sent ? (
        <p>Magic link has been sent! Check your email.</p>
      ) : (
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Your e-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ padding: 8, width: 250 }}
          />
          <br />
          <button style={{ marginTop: 10 }}>Send magic link</button>
        </form>
      )}
    </div>
  );
}
