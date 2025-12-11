import React, { useEffect, useState } from "react";
import { supabase } from "../utils/supabase";
import { useNavigate } from "react-router-dom";

import MultipleChoiceGame from "../components/MultipleChoiceGame";
import WordBuilder from "../components/WordBuilder";
import MissingLetterGame from "../components/MissingLetterGame";

export default function Practice() {
  const [words, setWords] = useState(null);
  const [stage, setStage] = useState(1);
  const nav = useNavigate();

  useEffect(() => {
    loadKnownWords();
  }, []);

  async function loadKnownWords() {
    const userId = localStorage.getItem("user_id");

    const { data, error } = await supabase
      .from("user_known_words")
      .select("word_id, words(*)")
      .eq("user_id", userId);

    if (error) {
      console.error("Error loading known words:", error);
      return;
    }

    const extracted = data.map(r => r.words);

    if (extracted.length === 0) {
      alert("You don't have any known words yet!");
      return nav("/progress");
    }

    setWords(extracted);
  }

  function restartPractice() {
    setStage(1);
  }

  if (!words) return <div className="page">Loading…</div>;

  return (
    <div className="page">
      <h2>Practice Session</h2>
      <p className="meta">Review your learned words through 3 mini-games</p>
      <p>Step {stage} / 3</p>

      {stage === 1 && (
        <MultipleChoiceGame 
          words={words} 
          onComplete={() => setStage(2)} 
        />
      )}

      {stage === 2 && (
        <WordBuilder 
          words={words} 
          onComplete={() => setStage(3)} 
        />
      )}

      {stage === 3 && (
        <MissingLetterGame 
          words={words} 
          onComplete={() => {
            alert("Practice session complete!");
            restartPractice();
          }}
        />
      )}
    </div>
  );
}
