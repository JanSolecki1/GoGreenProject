import React, { useState, useEffect } from "react";

export default function MissingLetterGame({ words = [], onComplete }) {
  const [index, setIndex] = useState(0);
  const [options, setOptions] = useState([]);
  const [masked, setMasked] = useState("");
  const alphabet = "abcdefghijklmnopqrstuvwxyzæøå";

  useEffect(() => {
    setIndex(0);
  }, [words]);

  useEffect(() => {
    if (!words || words.length === 0) return;
    const current = words[index];
    if (!current) return;

    // choose random position that is a letter (not space)
    let pos = Math.floor(Math.random() * current.da.length);
    // ensure not space
    if (current.da[pos] === " ") {
      pos = [...current.da].findIndex(ch => ch !== " ");
      if (pos === -1) pos = 0;
    }

    const correct = current.da[pos];
    const wrongs = alphabet
      .split("")
      .filter(l => l !== correct)
      .sort(() => Math.random() - 0.5)
      .slice(0, 2);

    setOptions([correct, ...wrongs].sort(() => Math.random() - 0.5));
    setMasked(current.da.slice(0, pos) + "_" + current.da.slice(pos + 1));
    // eslint-disable-next-line
  }, [words, index]);

  if (!words || words.length === 0) {
    return <div>Nothing to practice here.</div>;
  }

  const current = words[index];
  if (!current) return <div>Loading...</div>;
  if (!options || options.length === 0) return <div>Preparing...</div>;

  function pick(letter) {
    // find masked position
    const pos = masked.indexOf("_");
    const correct = current.da[pos];

    if (letter === correct) {
      if (index + 1 === words.length) {
        setTimeout(() => onComplete(), 300);
      } else {
        setIndex(i => i + 1);
      }
    } else {
      // wrong -> allow retry (no immediate penalty)
    }
  }

  return (
    <div>
      <h2>Missing Letter</h2>
      <h3 style={{ marginTop: 12 }}>{masked}</h3>

      <div style={{ marginTop: 10 }}>
        {options.map((l, i) => (
          <button key={i} onClick={() => pick(l)} style={{ marginRight: 8, marginTop: 6 }}>
            {l}
          </button>
        ))}
      </div>
    </div>
  );
}
