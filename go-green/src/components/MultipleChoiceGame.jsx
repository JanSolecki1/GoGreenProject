import React, { useState, useEffect } from "react";
import { supabase } from "../utils/supabase";
import NavBar from "./NavBar";



export default function MultipleChoiceGame({ words, onComplete }) {
  const [queue, setQueue] = useState([]);
  const [current, setCurrent] = useState(null);
  const [options, setOptions] = useState([]);
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    const q = [...words].sort(() => Math.random() - 0.5);
    setQueue(q);
    setCurrent(q[0]);
  }, [words]);

  useEffect(() => {
    if (!current) return;

    const wrong = [...words]
      .filter((w) => w.id !== current.id)
      .sort(() => Math.random() - 0.5)
      .slice(0, 2);

    const opts = [current.da, ...wrong.map((w) => w.da)].sort(
      () => Math.random() - 0.5
    );

    setOptions(opts);
  }, [current]);

  function pick(o) {
    if (o !== current.da) {
      setFeedback("❌ Incorrect — next word coming");
      return setTimeout(() => {
        setFeedback("");
        nextWord();
      }, 700);
    }

    setFeedback("✅ Correct!");
    setTimeout(() => {
      setFeedback("");
      nextWord();
    }, 500);
  }

  function nextWord() {
    const newQ = queue.slice(1);

    if (newQ.length === 0) return onComplete();
    setQueue(newQ);
    setCurrent(newQ[0]);
  }

  if (!current) return null;

  return (

    <div className="page">
      <h2>Multiple Choice</h2>

      <p className="meta">
        Choose the correct Danish word for the English meaning.  
        If you're wrong, a new word appears — try again!
      </p>

      <div className="card">
        <h3>{current.en}</h3>
      </div>

      {options.map((o, i) => (
        <button key={i} className="btn btn-outline" onClick={() => pick(o)}>
          {o}
        </button>
      ))}

      {feedback && <p className="feedback">{feedback}</p>}
    </div>
  );
}
