import React, { useEffect, useState } from "react";
import { supabase } from "../utils/supabase";
import { useNavigate } from "react-router-dom";

export default function SwipeDaily() {
  const [words, setWords] = useState([]);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [knownCount, setKnownCount] = useState(0);

  const nav = useNavigate();

  useEffect(() => {
    console.log("SWIPE DAILY MOUNTED");
    loadWords();
  }, []);

  async function loadWords() {
    setLoading(true);
    const userId = localStorage.getItem("user_id");
    if (!userId) return;

    // load known words
    const { data: known } = await supabase
      .from("user_known_words")
      .select("word_id")
      .eq("user_id", userId);

    const knownIds = known?.map(k => k.word_id) || [];

    // load all words
    const { data: all } = await supabase.from("words").select("*");
    if (!all) {
      setWords([]);
      setLoading(false);
      return;
    }

    // unknown words
    const unknown = all.filter(w => !knownIds.includes(w.id));

    // pick 10 random
    const shuffled = unknown.sort(() => Math.random() - 0.5).slice(0, 10);

    setWords(shuffled);
    setLoading(false);
  }

  async function handleKnow() {
    const userId = localStorage.getItem("user_id");
    const w = words[index];
    if (!w) return;

    // add only RIGHT swipes
    await supabase.from("user_to_verify").insert([
      { user_id: userId, word_id: w.id }
    ]);

    // increase knownCount
    setKnownCount(c => {
      const newValue = c + 1;

      // when 10 words selected → GO TO GAME
      if (newValue === 10) {
        setTimeout(() => nav("/game"), 300);
      }

      return newValue;
    });

    goNext();
  }

  function handleNotYet() {
    // LEFT → does NOT add anything
    goNext();
  }

  function goNext() {
    if (index + 1 < words.length) {
      setIndex(i => i + 1);
    } else {
      // if user has not selected 10 words, still go to game
      setTimeout(() => nav("/game"), 300);
    }
  }

  if (loading) return <div style={{ padding: 20 }}>Loading...</div>;
  if (words.length === 0) return <div style={{ padding: 20 }}>No words available.</div>;

  const current = words[index];

  return (
    <div style={{ padding: 20 }}>
      <h2>Daily words — swipe</h2>

      <div style={{ marginTop: 20 }}>
        <div><strong style={{ fontSize: 22 }}>{current.da}</strong></div>
        <div style={{ color: "#777" }}>{current.en}</div>

        <div style={{ marginTop: 15 }}>
          <button onClick={handleNotYet} style={{ marginRight: 10 }}>
            Not yet (left)
          </button>

          <button onClick={handleKnow}>
            I know (right)
          </button>
        </div>

        <div style={{ marginTop: 10 }}>
          {index + 1} / {words.length}
        </div>

        <div style={{ marginTop: 10 }}>
          Selected for training: {knownCount} / 10
        </div>
      </div>
    </div>
  );
}
