import React, { useEffect, useState } from "react";
import { shuffle, splitIntoFragments } from "../utils/gameUtils";

export default function WordBuilder({ words, onComplete }) {
  const [queue, setQueue] = useState([]);
  const [current, setCurrent] = useState(null);
  const [fragments, setFragments] = useState([]);
  const [built, setBuilt] = useState("");
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    const q = shuffle(words);
    setQueue(q);
    setCurrent(q[0]);
  }, [words]);

  useEffect(() => {
    if (!current) return;
    const parts = splitIntoFragments(current.da);
    setFragments(shuffle(parts));
    setBuilt("");
  }, [current]);

  function choose(frag) {
    const attempt = built + frag;

    if (!current.da.startsWith(attempt)) {
      setFeedback("Incorrect — next word");
      return setTimeout(() => {
        setFeedback("");
        nextWord();
      }, 600);
    }

    setBuilt(attempt);

    if (attempt === current.da) {
      setFeedback("Correct!");
      setTimeout(() => {
        setFeedback("");
        nextWord();
      }, 300);
    }
  }

  function nextWord() {
    const rest = queue.slice(1);
    if (rest.length === 0) return onComplete();
    setQueue(rest);
    setCurrent(rest[0]);
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
          <button
            key={i}
            className="btn btn-outline"
            onClick={() => choose(f)}
          >
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
