import React, { useEffect, useState } from "react";
import { splitIntoFragments, shuffle } from "../utils/gameUtils";
import LogoHeader from "./LogoHeader";
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
    setFragments(shuffle(splitIntoFragments(current.da)));
    setBuilt("");
  }, [current]);

  function choose(frag) {
    const attempt = built + frag;

    if (!current.da.startsWith(attempt)) {
      setFeedback("❌ Incorrect - new word coming");
      return setTimeout(() => {
        setFeedback("");
        nextWord();
      }, 1000);
    }

    setBuilt(attempt);

    if (attempt === current.da) {
      setFeedback("✅ Correct!");
      return setTimeout(() => {
        setFeedback("");
        nextWord();
      }, 700);
    }
  }

  function nextWord() {
    const newQ = queue.slice(1);
    if (newQ.length === 0) return onComplete();

    setQueue(newQ);
    setCurrent(newQ[0]);
  }

  return (

            <>
          <LogoHeader />

    <div className="page">
      <h2>Word Builder</h2>

      <p className="meta">
       Tap the pieces in the correct order to form the Danish word.
      </p>

      <div className="card">
        <h3>{built || "—"}</h3>
        <p>Meaning: {current?.en}</p>
      </div>

      {fragments.map((f, i) => (
        <button key={i} className="btn btn-outline" onClick={() => choose(f)}>
          {f}
        </button>
      ))}

      {feedback && <p className="feedback">{feedback}</p>}
    </div>
    </>
  );
}
