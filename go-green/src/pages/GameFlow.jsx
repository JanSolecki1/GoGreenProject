import React, { useEffect, useState } from "react";
import { supabase } from "../utils/supabase";
import { useNavigate } from "react-router-dom";

import MultipleChoiceGame from "../components/MultipleChoiceGame";
import WordBuilder from "../components/WordBuilder";
import MissingLetterGame from "../components/MissingLetterGame";

export default function GameFlow() {
  const [words, setWords] = useState(null);
  const [stage, setStage] = useState(1); // 1 MC, 2 WordBuilder, 3 MissingLetter
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
      nav("/words");
      return;
    }

    const extracted = data.map(row => row.words || row.word);
    setWords(extracted);
  }

  function nextStage() {
    setStage(s => s + 1);
  }

  async function finishAll() {
    const userId = localStorage.getItem("user_id");
    if (!userId) {
      nav("/login");
      return;
    }

    // insert known words
    const inserts = (words || []).map(w => ({ user_id: userId, word_id: w.id }));
    if (inserts.length > 0) {
      await supabase.from("user_known_words").insert(inserts);
    }

    // clear verify
    await supabase.from("user_to_verify").delete().eq("user_id", userId);

    // placeholder success animation: alert
    // you can replace with a nicer animation later
    alert(`✔️ Added ${inserts.length} words to known list!`);

    nav("/progress");
  }

  if (words === null) return <div style={{ padding: 20 }}>Loading mini-games...</div>;

  return (
    <div style={{ padding: 20 }}>
      <h2>Mini-games</h2>
      <p>Step {stage} / 3</p>

      {stage === 1 && <MultipleChoiceGame words={words} onComplete={nextStage} />}

      {stage === 2 && <WordBuilder words={words} onComplete={nextStage} />}

      {stage === 3 && <MissingLetterGame words={words} onComplete={finishAll} />}
    </div>
  );
}
