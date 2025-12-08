import React, { useEffect, useState } from "react";
import { supabase } from "../utils/supabase";
import { useNavigate } from "react-router-dom";

export default function SwipeDaily() {
  const [words, setWords] = useState([]);
  const [index, setIndex] = useState(0);
  const [toVerify, setToVerify] = useState([]); // RIGHT swipes
  const [notYet, setNotYet] = useState([]); // LEFT swipes
  const nav = useNavigate();

  useEffect(() => {
    loadWords();
  }, []);

  async function loadWords() {
    const { data, error } = await supabase
      .from("words")
      .select("*")
      .order("id")
      .limit(10);
    if (error) {
      console.error(error);
      return;
    }
    setWords(data || []);
  }

  function handleKnow() {
    // RIGHT swipe semantics per your latest plan:
    // RIGHT = "I think I know it" => we will VERIFY in mini-games
    const w = words[index];
    setToVerify(prev => [...prev, w]);
    next();
  }

  function handleNotYet() {
    // LEFT = still don't know => skip for now
    const w = words[index];
    setNotYet(prev => [...prev, w]);
    next();
  }

  function next() {
    if (index + 1 < words.length) {
      setIndex(i => i + 1);
    } else {
      // finished 10 swipes -> save to sessionStorage and go to games
      sessionStorage.setItem("toVerifyWords", JSON.stringify(toVerify.concat([]))); // current toVerify
      sessionStorage.setItem("notYetWords", JSON.stringify(notYet.concat([])));
      // small delay to ensure arrays updated (safe)
      setTimeout(() => nav("/game"), 150);
    }
  }

  if (!words || words.length === 0) return <div style={{ padding: 20 }}>Loading words...</div>;

  const current = words[index];

  return (
    <div style={{ padding: 20 }}>
      <h2>Today's words — swipe</h2>

      <div style={{ marginTop: 20 }}>
        <div>
          <strong>{current.da}</strong>
        </div>
        <div>{current.en}</div>
        <div style={{ marginTop: 12 }}>
          <button onClick={handleNotYet} style={{ marginRight: 10 }}>Not yet (left)</button>
          <button onClick={handleKnow}>I know (right)</button>
        </div>
        <div style={{ marginTop: 12 }}>
          {index + 1} / {words.length}
        </div>
      </div>
    </div>
  );
}
