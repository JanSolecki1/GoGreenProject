import React, { useState } from "react";

export default function PairingGame({ words, onComplete }) {
  // Two shuffled lists
  const left = [...words].sort(() => Math.random() - 0.5);
  const right = [...words].sort(() => Math.random() - 0.5);

  const [selected, setSelected] = useState(null); // { side: "left"/"right", word }
  const [matched, setMatched] = useState({});
  const [feedback, setFeedback] = useState("");

  function pick(side, word) {
    // ignore already matched
    if (matched[word.id]) return;

    // nothing selected yet
    if (!selected) {
      setSelected({ side, word });
      return;
    }

    // selected exists → try match
    if (selected.side !== side && selected.word.id === word.id) {
      // correct
      setMatched(prev => ({ ...prev, [word.id]: true }));
      setFeedback("correct");

      const totalMatches = Object.keys(matched).length + 1;
      if (totalMatches === words.length) {
        setTimeout(() => onComplete(), 500);
      }
    } else {
      // incorrect
      setFeedback("wrong");
    }

    // reset
    setSelected(null);
    setTimeout(() => setFeedback(""), 600);
  }

  function buttonStyle(wordId, side, selectedObj) {
    const base = {
      padding: 10,
      marginBottom: 8,
      cursor: "pointer",
    };

    if (matched[wordId]) {
      return { ...base, backgroundColor: "lightgreen" };
    }

    if (selectedObj?.word.id === wordId && selectedObj.side === side) {
      return { ...base, backgroundColor: "lightblue" };
    }

    return { ...base, backgroundColor: "#eee" };
  }

  return (
    <div style={{ display: "flex", gap: 40, marginTop: 20 }}>

      {/* LEFT SIDE (Danish words) */}
      <div>
        <h3>Danish</h3>
        {left.map(w => (
          <button
            key={w.id}
            onClick={() => pick("left", w)}
            style={buttonStyle(w.id, "left", selected)}
          >
            {w.da}
          </button>
        ))}
      </div>

      {/* RIGHT SIDE (English words) */}
      <div>
        <h3>English</h3>
        {right.map(w => (
          <button
            key={w.id}
            onClick={() => pick("right", w)}
            style={buttonStyle(w.id, "right", selected)}
          >
            {w.en}
          </button>
        ))}
      </div>

      {/* FEEDBACK */}
      <div style={{ fontSize: 20, marginLeft: 20 }}>
        {feedback === "correct" && <span style={{ color: "green" }}>✔</span>}
        {feedback === "wrong" && <span style={{ color: "red" }}>✘</span>}
      </div>
    </div>
  );
}
