import React, { useEffect, useState } from "react";
import { supabase } from "../utils/supabase";
import MultipleChoiceGame from "../components/MultipleChoiceGame";
import MatchingGame from "../components/MatchingGame";
import MissingLetterGame from "../components/MissingLetterGame";
import { useNavigate } from "react-router-dom";

export default function GameFlow() {
  const [words, setWords] = useState([]);
  const [stage, setStage] = useState(0); // 0 = MCQ, 1 = Match, 2 = MissingLetter
  const [loading, setLoading] = useState(true);

  const nav = useNavigate();

  useEffect(() => {
    loadWordsToVerify();
  }, []);

  async function loadWordsToVerify() {
    setLoading(true);

    const userId = localStorage.getItem("user_id");

    const { data, error } = await supabase
      .from("user_to_verify")
      .select("word_id, words(*)")
      .eq("user_id", userId);

    if (error) {
      console.error(error);
      setLoading(false);
      return;
    }

    const list = data.map(row => row.words);

    setWords(list);
    setLoading(false);
  }

  async function finishGame() {
    const userId = localStorage.getItem("user_id");

    // insert known words
    for (const w of words) {
      await supabase
        .from("user_known_words")
        .insert({ user_id: userId, word_id: w.id });
    }

    // clear user_to_verify
    await supabase
      .from("user_to_verify")
      .delete()
      .eq("user_id", userId);

    alert("🎉 Great job! You learned new words!");

    nav("/progress");
  }

  function nextStage() {
    if (stage < 2) setStage(stage + 1);
    else finishGame();
  }

  if (loading) return <div style={{ padding: 20 }}>Loading games...</div>;

  return (
    <div style={{ padding: 20 }}>
      <h2>Mini-games</h2>

      {stage === 0 && (
        <MultipleChoiceGame words={words} onComplete={nextStage} />
      )}

      {stage === 1 && (
        <MatchingGame words={words} onComplete={nextStage} />
      )}

      {stage === 2 && (
        <MissingLetterGame words={words} onComplete={nextStage} />
      )}
    </div>
  );
}
