import React, { useState, useEffect } from "react";

export default function MissingLetterGame({ words = [], onComplete }) {
  const [queue, setQueue] = useState([]);
  const [current, setCurrent] = useState(null);
  const [masked, setMasked] = useState("");
  const [options, setOptions] = useState([]);
  const [feedback, setFeedback] = useState("");

  const alphabet = "abcdefghijklmnopqrstuvwxyzæøå".split("");

  useEffect(() => {
    if (!words || words.length === 0) {
      setQueue([]);
      setCurrent(null);
      return;
    }
    const q = [...words].sort(() => Math.random() - 0.5);
    setQueue(q);
    setCurrent(q[0]);
  }, [words]);

  useEffect(() => {
    if (!current) return;
    prepare(current);
    // eslint-disable-next-line
  }, [current]);

  function prepare(word) {
    // choose a non-space position
    let pos = Math.floor(Math.random() * word.da.length);
    if (word.da[pos] === " ") {
      pos = [...word.da].findIndex(ch => ch !== " ");
      if (pos === -1) pos = 0;
    }
    const correct = word.da[pos];
    const wrongs = alphabet.filter(l => l !== correct).sort(() => Math.random() - 0.5).slice(0, 2);
    const opts = [correct, ...wrongs].sort(() => Math.random() - 0.5);
    setOptions(opts);
    setMasked(word.da.slice(0, pos) + "_" + word.da.slice(pos + 1));
  }

  function pick(letter) {
    const pos = masked.indexOf("_");
    const correct = current.da[pos];

    if (letter === correct) {
      // correct -> remove current
      setFeedback("Correct!");
      setTimeout(() => {
        setFeedback("");
        const remaining = queue.slice(1);
        if (remaining.length === 0) {
          onComplete();
        } else {
          setQueue(remaining);
          setCurrent(remaining[0]);
        }
      }, 300);
    } else {
      // incorrect -> show feedback and move to next
      setFeedback("Incorrect — moving to next word");
      setTimeout(() => {
        setFeedback("");
        const newQueue = [...queue.slice(1), queue[0]]; // push to back
        setQueue(newQueue);
        setCurrent(newQueue[0]);
      }, 500);
    }
  }

  if (!current) return <div>No words here.</div>;

  return (
    <div>
      <h2>Missing Letter</h2>
      <h3 style={{ marginTop: 12 }}>{masked}</h3>

      <div style={{ marginTop: 12 }}>
        {options.map((o, i) => (
          <button key={i} onClick={() => pick(o)} style={{ display: "block", width: "100%", padding: 14, marginBottom: 8, fontSize: 18 }}>
            {o}
          </button>
        ))}
      </div>

      <div style={{ height: 28, marginTop: 8 }}>
        {feedback && <strong>{feedback}</strong>}
      </div>
    </div>
  );
}
