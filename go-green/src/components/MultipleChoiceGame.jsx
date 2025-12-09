import React, { useEffect, useState } from "react";

export default function MissingLetterGame({ words, onComplete }) {
  const [queue, setQueue] = useState([]);
  const [current, setCurrent] = useState(null);
  const [masked, setMasked] = useState("");
  const [missingPos, setMissingPos] = useState(null); // <- poprawka
  const [options, setOptions] = useState([]);
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    const q = [...words].sort(() => Math.random() - 0.5);
    setQueue(q);
    setCurrent(q[0]);
  }, [words]);

  useEffect(() => {
    if (!current) return;
    prepareWord(current);
  }, [current]);

  function prepareWord(word) {
    // losujemy pozycję
    const pos = Math.floor(Math.random() * word.da.length);
    const correct = word.da[pos];

    setMissingPos(pos); // <- PRZECHOWUJEMY POPRAWNĄ POZYCJĘ

    // tworzymy maskowane słowo
    const maskedWord =
      word.da.slice(0, pos) + "_" + word.da.slice(pos + 1);

    setMasked(maskedWord);

    // trzy opcje: correct + 2 złe
    const alphabet = "abcdefghijklmnopqrstuvwxyzæøå".split("");
    const wrong = alphabet
      .filter((l) => l !== correct)
      .sort(() => Math.random() - 0.5)
      .slice(0, 2);

    setOptions([correct, ...wrong].sort(() => Math.random() - 0.5));
  }

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
    }, 400);
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
      <h2>Missing Letter</h2>

      <div className="card">
        <h3>{masked}</h3>
      </div>

      <div className="btn-group">
        {options.map((o, i) => (
          <button
            key={i}
            className="btn btn-outline"
            onClick={() => pick(o)}
          >
            {o}
          </button>
        ))}
      </div>

      {feedback && (
        <div
          className={`feedback ${
            feedback.includes("Correct") ? "success" : "error"
          }`}
        >
          {feedback}
        </div>
      )}
    </div>
  );
}
