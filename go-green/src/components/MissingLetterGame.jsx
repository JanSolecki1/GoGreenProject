import React, { useEffect, useState } from "react";
import { shuffle } from "../utils/gameUtils";

export default function MissingLetterGame({ words, onComplete }) {
  const [queue, setQueue] = useState([]);
  const [current, setCurrent] = useState(null);
  const [masked, setMasked] = useState("");
  const [missingPos, setMissingPos] = useState(null);
  const [options, setOptions] = useState([]);
  const [feedback, setFeedback] = useState("");

  const alphabet = "abcdefghijklmnopqrstuvwxyzæøå".split("");

  useEffect(() => {
    const q = shuffle(words);
    setQueue(q);
    setCurrent(q[0]);
  }, [words]);

  useEffect(() => {
    if (!current) return;

    const pos = Math.floor(Math.random() * current.da.length);
    setMissingPos(pos);

    const correct = current.da[pos];
    const maskedWord = current.da.slice(0, pos) + "_" + current.da.slice(pos + 1);
    setMasked(maskedWord);

    const wrong = shuffle(alphabet.filter((l) => l !== correct)).slice(0, 2);
    setOptions(shuffle([correct, ...wrong]));
  }, [current]);

  function pick(letter) {
    const correct = current.da[missingPos];

    if (letter !== correct) {
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
      <h2>Missing Letter</h2>

      <div className="card">
        <h3>{masked}</h3>
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
