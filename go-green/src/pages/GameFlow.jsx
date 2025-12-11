import React, { useEffect, useState } from "react";
import { supabase } from "../utils/supabase";
import { useNavigate } from "react-router-dom";

import MultipleChoiceGame from "../components/MultipleChoiceGame";
import WordBuilder from "../components/WordBuilder";
import MissingLetterGame from "../components/MissingLetterGame";

export default function GameFlow() {
  const [words, setWords] = useState(null);
  const [stage, setStage] = useState(1);
  const nav = useNavigate();

  useEffect(() => {
    loadWords();
  }, []);

  async function loadWords() {
    const userId = localStorage.getItem("user_id");

    const { data } = await supabase
      .from("user_to_verify")
      .select("word_id, words(*)")
      .eq("user_id", userId);

    const selected = data.map((r) => r.words);

    setWords(selected);
  }

  async function finishAll() {
    const userId = localStorage.getItem("user_id");

    await supabase.from("user_known_words").insert(
      words.map((w) => ({ user_id: userId, word_id: w.id }))
    );

    await supabase.from("user_to_verify").delete().eq("user_id", userId);

    nav("/progress");
  }

  if (!words) return <div className="page">Loading…</div>;

  return (
    <div className="page">

{stage === 1 && (
  <MultipleChoiceGame words={words} onComplete={() => setStage(2)} />
)}

{stage === 2 && (
  <MissingLetterGame words={words} onComplete={() => setStage(3)} />
)}

{stage === 3 && (
  <WordBuilder words={words} onComplete={finishAll} />
)}
    </div>
  );
}
