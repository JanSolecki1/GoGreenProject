import React, { useState, useEffect } from "react";
import { supabase } from "../utils/supabase";
import { useNavigate } from "react-router-dom";

import MultipleChoiceGame from "../components/MultipleChoiceGame";
import PairingGame from "../components/PairingGame";
import MissingLetterGame from "../components/MissingLetterGame";

export default function GameFlow() {
  const [words, setWords] = useState(null); // null = not loaded yet
  const [stage, setStage] = useState(1);
  const nav = useNavigate();

  useEffect(() => {
    loadWordsToVerify();
    // eslint-disable-next-line
  }, []);

  async function loadWordsToVerify() {
    const userId = localStorage.getItem("user_id");
    if (!userId) {
      nav("/login");
      return;
    }

    const { data, error } = await supabase
      .from("user_to_verify")
      .select("word_id, words(*)")
      .eq("user_id", userId);

    if (error) {
      console.error("Error loading verify list:", error);
      nav("/words");
      return;
    }

    if (!data || data.length === 0) {
      // no words to verify -> go back to swipe
      nav("/words");
      return;
    }

    // Map depending on structure: if row.words exists, use it; else try to fetch from words table
    const extracted = data.map(row => row.words || row.word); // defensive
    setWords(extracted);
  }

  function nextStage() {
    setStage(s => s + 1);
  }

  async function finishAll() {
    const userId = localStorage.getItem("user_id");

    // add all verified words to known
    const inserts = (words || []).map(w => ({
      user_id: userId,
      word_id: w.id
    }));

    if (inserts.length > 0) {
      await supabase.from("user_known_words").insert(inserts);
    }

    // clear verification table
    await supabase
      .from("user_to_verify")
      .delete()
      .eq("user_id", userId);

    nav("/progress");
  }

  // guard: wait until words loaded
  if (words === null) {
    return <div style={{ padding: 20 }}>Loading mini-games...</div>;
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Mini games</h2>
      <p>Step {stage} / 3</p>

      {stage === 1 && <MultipleChoiceGame words={words} onComplete={nextStage} />}

      {stage === 2 && <PairingGame words={words} onComplete={nextStage} />}

      {stage === 3 && <MissingLetterGame words={words} onComplete={finishAll} />}
    </div>
  );
}
