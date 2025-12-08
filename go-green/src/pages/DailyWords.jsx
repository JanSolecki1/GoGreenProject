import React, { useEffect, useState } from "react";
import { supabase } from "../utils/supabase";
import WordCard from "../components/WordCard";

export default function DailyWords() {
  const [words, setWords] = useState([]);
  const [learned, setLearned] = useState([]);

  useEffect(() => {
    loadWords();
    loadLearned();
  }, []);

  async function loadWords() {
    const { data, error } = await supabase
      .from("words")
      .select("*")
      .order("id")
      .limit(10);

    if (!error) setWords(data);
  }

  async function loadLearned() {
    const { data } = await supabase.from("progress").select("word_id");
    setLearned(data ? data.map((r) => r.word_id) : []);
  }

  async function markLearned(id) {
    await supabase.from("progress").insert({ word_id: id });
    loadLearned();
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Today's words</h2>

      {words.map((w) => (
        <WordCard
          key={w.id}
          word={w}
          learned={learned.includes(w.id)}
          onMarkLearned={markLearned}
        />
      ))}

      <div style={{ marginTop: 15 }}>
        <a href="/game">Start Mini-Game</a>
      </div>
    </div>
  );
}
