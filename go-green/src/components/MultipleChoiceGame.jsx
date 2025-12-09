import React, { useState, useEffect } from "react";

export default function MultipleChoiceGame({ words = [], onComplete }) {
  const [queue, setQueue] = useState([]);
  const [current, setCurrent] = useState(null);
  const [options, setOptions] = useState([]);
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    if (!words || words.length === 0) {
      setQueue([]);
      setCurrent(null);
      return;
    }
    const shuffled = [...words].sort(() => Math.random() - 0.5);
    setQueue(shuffled);
    setCurrent(shuffled[0]);
  }, [words]);

  useEffect(() => {
    if (!current) return;
    generateOptions(current);
    // eslint-disable-next-line
  }, [current]);

  function generateOptions(correct) {
    const wrong = words.filter(w => w.id !== correct.id).sort(() => Math.random() - 0.5).slice(0, 2);
    const opts = [...wrong, correct].sort(() => Math.random() - 0.5);
    setOptions(opts);
  }

  function nextWordAfterWrong(oldQueue) {
    // push current to back and take next
    const newQueue = [...oldQueue.slice(1), oldQueue[0]];
    setQueue(newQueue);
    setCurrent(newQueue[0]);
  }

  function handlePick(opt) {
    if (!current) return;
    if (opt.id === current.id) {
      // correct: remove this word from queue (advance)
      const newQueue = queue.slice(1);
      if (newQueue.length === 0) {
        setFeedback("Correct!");
        setTimeout(() => onComplete(), 300);
      } else {
        setFeedback("Correct!");
        setTimeout(() => {
          setFeedback("");
          setQueue(newQueue);
          setCurrent(newQueue[0]);
        }, 250);
      }
    } else {
      // wrong: show feedback and move current to back (new word appears)
      setFeedback("Incorrect — try next word");
      const oldQueue = queue.length ? queue : [current];
      setTimeout(() => {
        setFeedback("");
        nextWordAfterWrong(oldQueue);
      }, 500);
    }
  }

  if (!current) return <div>No questions available.</div>;

  return (
    <div>
      <h2>Multiple Choice</h2>
      <h3 style={{ marginTop: 12 }}>{current.da}</h3>

      <div style={{ marginTop: 12 }}>
        {options.map(o => (
          <button
            key={o.id}
            onClick={() => handlePick(o)}
            style={{ display: "block", width: "100%", padding: 16, marginBottom: 10, fontSize: 18 }}
          >
            {o.en}
          </button>
        ))}
      </div>

      <div style={{ height: 28, marginTop: 8 }}>
        {feedback && <strong>{feedback}</strong>}
      </div>
    </div>
  );
}
