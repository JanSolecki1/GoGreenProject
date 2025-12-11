import React, { useEffect, useState } from "react";
import { supabase } from "../utils/supabase";
import { useNavigate } from "react-router-dom";

export default function SwipeDaily() {
  const [words, setWords] = useState([]);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [count, setCount] = useState(0); // licznik I KNOW
  const nav = useNavigate();

  useEffect(() => {
    loadWords();
  }, []);

  async function loadWords() {
    setLoading(true);
    const userId = localStorage.getItem("user_id");

    // 1) Pobierz known words
    const { data: known } = await supabase
      .from("user_known_words")
      .select("word_id")
      .eq("user_id", userId);

    const knownIds = known?.map(k => k.word_id) || [];

    // 2) Pobierz wszystkie słowa
    const { data: allWords } = await supabase
      .from("words")
      .select("*")
      .order("id");

    // 3) Filtruj UNKNOWN
    const unknown = allWords.filter(w => !knownIds.includes(w.id));

    setWords(unknown);
    setIndex(0);
    setLoading(false);
  }

  // ✔️ user wybrał słowo
  async function handleKnow() {
    const userId = localStorage.getItem("user_id");
    const w = words[index];

    await supabase.from("user_to_verify").insert([
      { user_id: userId, word_id: w.id }
    ]);

    const newCount = count + 1;
    setCount(newCount);

    if (newCount >= 10) {
      return nav("/game");
    }

    nextWord();
  }

  // ✔️ user NIE wybrał słowa
  function handleNotYet() {
    nextWord();
  }

  function nextWord() {
    if (index + 1 < words.length) {
      setIndex(i => i + 1);
    } else {
      alert("You've reached the end — pick 10 words first.");
    }
  }

  if (loading) return <div className="page">Loading…</div>;
  if (words.length === 0)
    return <div className="page">All words learned 🎉</div>;

  const current = words[index];

  return (
    <div className="page">
      <h2>Choose the words</h2>
      <p>Choose the 10 Danish words you want to learn and practice in mini-games</p>

      <div className="card">
  <div style={{ marginBottom: 8 }}>
    <small style={{ fontSize: 12, opacity: 0.7 }}>Danish word</small>
    <h3 style={{ margin: 0 }}>{current.da}</h3>
  </div>

  <div>
    <small style={{ fontSize: 12, opacity: 0.7 }}>Translation</small>
    <p style={{ margin: 0 }}>{current.en}</p>
  </div>
</div>

      <div className="btn-group">
        <button className="btn btn-outline" onClick={handleNotYet}>
          Skip
        </button>

        <button className="btn btn-primary" onClick={handleKnow}>
          Add word
        </button>
      </div>

      <p className="meta">{count} / 10 selected</p>
    </div>
  );
}
