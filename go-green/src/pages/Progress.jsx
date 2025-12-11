import React, { useEffect, useState } from "react";
import { supabase } from "../utils/supabase";

export default function Progress() {
  const [recentWords, setRecentWords] = useState([]);
  const [streak, setStreak] = useState(0);
  const [anim, setAnim] = useState(false);

  useEffect(() => {
    loadProgress();
    animateCongrats();
  }, []);

  async function loadProgress() {
    const userId = localStorage.getItem("user_id");

    // LOAD last 10 learned words
    const { data } = await supabase
      .from("user_known_words")
      .select("created_at, words(*)")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(10);

    setRecentWords(data.map((r) => r.words));

    // LOAD streak
    const saved = localStorage.getItem("streak");
    const lastDay = localStorage.getItem("last_completion");

    const today = new Date().toDateString();

    if (lastDay === today) {
      setStreak(Number(saved || 1));
    } else {
      const yesterday = new Date(Date.now() - 86400000).toDateString();
      const newStreak = lastDay === yesterday ? Number(saved || 0) + 1 : 1;

      localStorage.setItem("streak", newStreak);
      localStorage.setItem("last_completion", today);

      setStreak(newStreak);
    }
  }

  function animateCongrats() {
    setTimeout(() => setAnim(true), 100); // play animation after mount
  }

  return (
    <div className="page">

      {/* --- Congrats Animation --- */}
      <div
        style={{
          textAlign: "center",
          transform: anim ? "scale(1)" : "scale(0.6)",
          opacity: anim ? 1 : 0,
          transition: "all 0.5s ease"
        }}
      >
        <h2>🎉 Great job!</h2>
        <p>You learned 10 new words today.</p>
      </div>

      {/* --- Recent 10 words --- */}
      <div className="card">
        <h3>Today's words</h3>

        {recentWords.length === 0 && (
          <p>No completed words yet.</p>
        )}

        {recentWords.map((w) => (
          <p key={w.id}>
            <strong>{w.da}</strong> — {w.en}
          </p>
        ))}
      </div>

      {/* --- Daily streak --- */}
      <div className="card">
        <h3>🔥 Daily streak</h3>
        <p>{streak} day{streak === 1 ? "" : "s"} in a row</p>
      </div>

      {/* --- Practice button --- */}
      <button
        className="btn btn-primary"
        onClick={() => (window.location.href = "/practise")}
      >
        Practice known words
      </button>

    </div>
  );
}
