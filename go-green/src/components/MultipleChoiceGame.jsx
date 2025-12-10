import React, { useState, useEffect } from "react";

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

    const opts = [current.da, ...wrong.map((w) => w.da)]
      .sort(() => Math.random() - 0.5);

    setOptions(opts);
  }, [current]);

  function pick(answer) {
    if (answer !== current.da) {
      setFeedback("Incorrect — next word");
      return setTimeout(() => {
        setFeedback("");
        nextWord();
      }, 600);
    }

    setFeedback("Correct!");
    setTimeout(() => {
      setFeedback("");
      nextWord();
    }, 300);
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
      <h2>Multiple Choice</h2>

      <div className="card">
        <p>Meaning:</p>
        <h3>{current.en}</h3>
      </div>

      <div className="btn-group">
        {options.map((o, i) => (
          <button key={i} className="btn btn-outline" onClick={() => pick(o)}>
            {o}
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
