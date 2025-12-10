import React, { useEffect, useState } from "react";
import { supabase } from "../utils/supabase";
import { useNavigate } from "react-router-dom";

export default function SwipeDaily() {
  const [words, setWords] = useState([]);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const nav = useNavigate();

  useEffect(() => {
    loadWords();
  }, []);

  async function loadWords() {
    setLoading(true);
    const userId = localStorage.getItem("user_id");

    // LOAD known words
    const { data: known } = await supabase
      .from("user_known_words")
      .select("word_id")
      .eq("user_id", userId);

    const knownIds = known?.map((k) => k.word_id) || [];

    // LOAD all words
    const { data: all } = await supabase.from("words").select("*");

    // FILTER unknown only
    const unknown = all.filter((w) => !knownIds.includes(w.id));

    // PICK 10 random
    const random10 = unknown.sort(() => Math.random() - 0.5).slice(0, 10);

    setWords(random10);
    setIndex(0);
    setLoading(false);
  }

  async function handleKnow() {
    const w = words[index];
    const userId = localStorage.getItem("user_id");

    // INSERT selected word
    await supabase.from("user_to_verify").insert([
      { user_id: userId, word_id: w.id }
    ]);

    // check count
    const { data: verify } = await supabase
      .from("user_to_verify")
      .select("id")
      .eq("user_id", userId);

    if (verify.length >= 10) return nav("/game");

    goNext();
  }

  function handleNotYet() {
    goNext();
  }

  async function goNext() {
    const userId = localStorage.getItem("user_id");

    if (index + 1 < words.length) {
      setIndex((i) => i + 1);
      return;
    }

    // end of list — check count
    const { data: verify } = await supabase
      .from("user_to_verify")
      .select("id")
      .eq("user_id", userId);

    if (verify.length >= 10) {
      return nav("/game");
    }

    // need more words
    loadWords();
  }

  if (loading) return <div className="page">Loading...</div>;
  if (words.length === 0)
    return <div className="page">No words available.</div>;

  const current = words[index];

  return (
    <div className="page">
      <h2>Daily Words</h2>

      <div className="card">
        <h3>{current.da}</h3>
        <p>{current.en}</p>
      </div>

      <button className="btn btn-outline" onClick={handleNotYet}>
        Not yet
      </button>

      <button className="btn btn-primary" onClick={handleKnow}>
        I know
      </button>

      <p>
        {index + 1} / {words.length}
      </p>
    </div>
  );
}
