import React, { useEffect, useState } from "react";

export default function MissingLetterGame({ words, onComplete }) {
  const [queue, setQueue] = useState([]);
  const [current, setCurrent] = useState(null);
  const [masked, setMasked] = useState("");
  const [pos, setPos] = useState(null);
  const [options, setOptions] = useState([]);
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    const q = [...words].sort(() => Math.random() - 0.5);
    setQueue(q);
    setCurrent(q[0]);
  }, [words]);

  useEffect(() => {
    if (!current) return;
    prepare(current);
  }, [current]);

  function prepare(word) {
    const p = Math.floor(Math.random() * word.da.length);
    setPos(p);

    setMasked(word.da.slice(0, p) + "_" + word.da.slice(p + 1));

    const correct = word.da[p];
    const alphabet = "abcdefghijklmnopqrstuvwxyzæøå".split("");

    const wrong = alphabet
      .filter((l) => l !== correct)
      .sort(() => Math.random() - 0.5)
      .slice(0, 2);

    setOptions([correct, ...wrong].sort(() => Math.random() - 0.5));
  }

  function pick(l) {
    const correct = current.da[pos];

    if (l !== correct) {
      setFeedback("❌ Incorrect — next word coming");
      return setTimeout(() => {
        setFeedback("");
        next();
      }, 700);
    }

    setFeedback("✅ Correct!");
    setTimeout(() => {
      setFeedback("");
      next();
    }, 500);
  }

  function next() {
    const newQ = queue.slice(1);
    if (newQ.length === 0) return onComplete();
    setQueue(newQ);
    setCurrent(newQ[0]);
  }

  return (
    <div className="page">
      <h2>Missing Letter</h2>

      <p className="meta">
        One letter is missing from the Danish word.  
        Pick the correct letter to complete it.  
        If you're wrong, a new word appears.
      </p>

      <div className="card">
        <h3>{masked}</h3>
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
