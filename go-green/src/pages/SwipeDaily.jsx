import React, { useEffect, useState } from "react";
import { supabase } from "../utils/supabase";
import { useNavigate } from "react-router-dom";

export default function SwipeDaily() {
  const [words, setWords] = useState([]);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const nav = useNavigate();

  useEffect(() => {
    resetVerify();
    loadWords();
  }, []);

  async function resetVerify() {
    const userId = localStorage.getItem("user_id");
    await supabase.from("user_to_verify").delete().eq("user_id", userId);
  }

  async function loadWords() {
    setLoading(true);

    const userId = localStorage.getItem("user_id");

    // known
    const { data: known } = await supabase
      .from("user_known_words")
      .select("word_id")
      .eq("user_id", userId);

    const knownIds = known?.map(w => w.word_id) || [];

    // all words
    const { data: all } = await supabase.from("words").select("*");

    const unknown = all.filter(w => !knownIds.includes(w.id));

    const random10 = unknown.sort(() => Math.random() - 0.5).slice(0, 10);

    setWords(random10);
    setIndex(0);
    setLoading(false);
  }

  async function handleKnow() {
    const userId = localStorage.getItem("user_id");
    const w = words[index];

    await supabase
      .from("user_to_verify")
      .insert([{ user_id: userId, word_id: w.id }]);

    const { data: verify } = await supabase
      .from("user_to_verify")
      .select("*")
      .eq("user_id", userId);

    if (verify.length >= 10) return nav("/game");

    goNext();
  }

  function handleNotYet() {
    goNext();
  }

  function goNext() {
    if (index + 1 < words.length) {
      setIndex(i => i + 1);
    } else {
      loadWords(); // reload unknown if user didn't choose 10 yet
    }
  }

  if (loading) return <div className="page">Loading…</div>;
  if (words.length === 0) return <div className="page">No words available.</div>;

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

      <p>{index + 1} / {words.length}</p>
    </div>
  );
}
