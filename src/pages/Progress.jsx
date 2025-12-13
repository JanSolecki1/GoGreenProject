import React, { useEffect, useState } from "react";
import { supabase } from "../utils/supabase";
import LogoHeader from "../components/LogoHeader";

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
    if (!userId) return;

    // ---------- LOAD LAST 10 LEARNED WORDS ----------
    const { data, error } = await supabase
      .from("user_known_words")
      .select("created_at, word_id")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(10);

    if (error || !data) {
      console.error("Error loading known words:", error);
      setRecentWords([]);
    } else {
      const ids = data.map((r) => r.word_id);

      // fetch words separately
      const { data: words } = await supabase
        .from("words")
        .select("*")
        .in("id", ids);

      setRecentWords(words || []);
    }

    // ---------- STREAK LOGIC ----------
    const saved = Number(localStorage.getItem("streak") || 0);
    const lastDay = localStorage.getItem("last_completion");
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();

    let newStreak = 1;

    if (lastDay === today) {
      // already counted today → keep streak
      newStreak = saved;
    } else if (lastDay === yesterday) {
      // streak continues
      newStreak = saved + 1;
    } else {
      // streak reset
      newStreak = 1;
    }

    localStorage.setItem("streak", newStreak);
    localStorage.setItem("last_completion", today);
    setStreak(newStreak);
  }

  function animateCongrats() {
    setTimeout(() => setAnim(true), 200);
  }

  return (
    <>
      <LogoHeader />

      <div className="page">

        {/* Congrats Animation */}
        <div
          style={{
            textAlign: "center",
            transform: anim ? "scale(1)" : "scale(0.6)",
            opacity: anim ? 1 : 0,
            transition: "all 0.5s ease"
          }}
        >
          <h2>🎉 Great job!</h2>
          <p>You learned 10 new words today!</p>
        </div>

        {/* Today's Words */}
        <div className="card">
          <h3>Words you know</h3>

          {recentWords.length === 0 && <p>No completed words yet.</p>}

          {recentWords.map((w) => (
            <p key={w.id}>
              <strong>{w.da}</strong> - <i>{w.en}</i>
            </p>
          ))}
        </div>

        {/* Streak */}
        <div className="card">
          <h3>🔥 Daily streak</h3>
          <p>{streak} day{streak === 2 ? "" : "s"} in a row</p>
        </div>

        {/* Practice known words */}
        <button
          className="btn btn-primary"
          onClick={() => (window.location.href = "/game")}
        >
          Practice known words
        </button>

      </div>
    </>
  );
}
