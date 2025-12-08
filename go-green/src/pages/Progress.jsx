import React, { useEffect, useState } from "react";
import { supabase } from "../utils/supabase";

export default function Progress() {
  const [words, setWords] = useState([]);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    loadProgress();
    // eslint-disable-next-line
  }, []);

  async function loadProgress() {
    const userId = localStorage.getItem("user_id");
    if (!userId) return;

    // load known words joined
    const { data } = await supabase
      .from("user_known_words")
      .select("word_id, words(*)")
      .eq("user_id", userId);

    const knownWords = (data || []).map(r => r.words).filter(Boolean);
    setWords(knownWords);

    // load streak
    const { data: s } = await supabase.from("user_streak").select("streak_days").eq("user_id", userId).single();
    if (s) setStreak(s.streak_days || 0);
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Your Progress</h2>
      <div>Words learned: {words.length}</div>
      <div>Streak days: {streak}</div>

      <ul>
        {words.map(w => (
          <li key={w.id}>{w.da} — {w.en}</li>
        ))}
      </ul>
    </div>
  );
}
