import React, { useEffect, useState } from "react";
import { supabase } from "../utils/supabase";
import { useNavigate } from "react-router-dom";


export default function WordBuilder({ words, onComplete }) {
  const [queue, setQueue] = useState([]);
  const [current, setCurrent] = useState(null);
  const [fragments, setFragments] = useState([]);
  const [built, setBuilt] = useState("");
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    const q = [...words].sort(() => Math.random() - 0.5);
    setQueue(q);
    setCurrent(q[0]);
  }, [words]);

  useEffect(() => {
    if (!current) return;
    const parts = splitIntoFragments(current.da);
    const pool = shuffle([...parts]);
    setFragments(pool);
    setBuilt("");
  }, [current]);

  function choose(frag) {
    const attempt = built + frag;

    if (!current.da.startsWith(attempt)) {
      setFeedback("Incorrect — next word");
      setTimeout(() => setFeedback(""), 600);
      return nextWord();
    }

    setBuilt(attempt);

    if (attempt === current.da) {
      setFeedback("Correct!");
      setTimeout(() => {
        setFeedback("");
        nextWord(true);
      }, 300);
    }
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
      <h2>Word Builder</h2>

      <div className="card">
        <p>Meaning: {current.en}</p>
        <h3>{built || "—"}</h3>
      </div>

      <div className="grid-2">
        {fragments.map((f, i) => (
          <button key={i} className="btn btn-outline" onClick={() => choose(f)}>
            {f}
          </button>
        ))}
      </div>

      {feedback && (
        <div className={`feedback ${feedback.includes("Correct") ? "success" : "error"}`}>
          {feedback}
        </div>
      )}
    </div>
  );
}
