import React, { useState, useEffect } from "react";
import MatchGame from "../components/MatchGame";
import { supabase } from "../utils/supabase";
import { useNavigate } from "react-router-dom";

export default function MiniGame() {
  const [words, setWords] = useState([]);
  const nav = useNavigate();

  useEffect(() => {
    loadWords();
  }, []);

  async function loadWords() {
    const { data } = await supabase
      .from("words")
      .select("*")
      .order("id")
      .limit(10);

    setWords(data);
  }

  async function handleFinish(ids) {
    const inserts = ids.map((id) => ({ word_id: id }));
    await supabase.from("progress").insert(inserts);
    nav("/progress");
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Word Match</h2>
      <MatchGame words={words} onFinish={handleFinish} />
    </div>
  );
}
