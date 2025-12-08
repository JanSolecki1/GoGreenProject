import React, { useEffect, useState } from "react";
import { supabase } from "../utils/supabase";

export default function Progress() {
  const [words, setWords] = useState([]);

  useEffect(() => {
    loadProgress();
  }, []);

  async function loadProgress() {
    const { data } = await supabase
      .from("progress")
      .select("word_id, words(*)");

    setWords(data.map((row) => row.words));
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Your Progress</h2>

      <div>Words learned: {words.length}</div>

      <ul>
        {words.map((w) => (
          <li key={w.id}>
            {w.da} — {w.en}
          </li>
        ))}
      </ul>
    </div>
  );
}
