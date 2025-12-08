import React, { useState, useEffect } from "react";

export default function MultipleChoiceGame({ words = [], onComplete }) {
  const [index, setIndex] = useState(0);
  const [options, setOptions] = useState([]);

  // guard: jeśli nie ma words lub words.length === 0 -> nic nie renderuj
  useEffect(() => {
    setIndex(0);
  }, [words]);

  useEffect(() => {
    if (!words || words.length === 0) return;
    const current = words[index];
    if (!current) return;

    const wrong = words
      .filter(w => w.id !== current.id)
      .sort(() => Math.random() - 0.5)
      .slice(0, 2);

    const opts = [...wrong, current].sort(() => Math.random() - 0.5);
    setOptions(opts);
    // eslint-disable-next-line
  }, [words, index]);

  if (!words || words.length === 0) {
    return <div>Nothing to practice here.</div>;
  }

  const current = words[index];
  if (!current) return <div>Loading question...</div>;

  function pick(option) {
    if (option.id === current.id) {
      // correct
      if (index + 1 === words.length) {
        setTimeout(() => onComplete(), 300);
      } else {
        setIndex(i => i + 1);
      }
    } else {
      // wrong -> we simply show nothing else, user can try again (optionally add feedback)
    }
  }

  return (
    <div>
      <h2>Multiple Choice</h2>
      <h3 style={{ marginTop: 12 }}>{current.da}</h3>

      {options.map(o => (
        <button
          key={o.id}
          onClick={() => pick(o)}
          style={{ display: "block", marginBottom: 8 }}
        >
          {o.en}
        </button>
      ))}
    </div>
  );
}
