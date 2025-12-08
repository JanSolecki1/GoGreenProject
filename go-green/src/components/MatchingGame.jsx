import React, { useState } from "react";

export default function MatchingGame({ words, onComplete }) {
  const [left] = useState(words.map(w => ({ id: w.id, text: w.da })));
  const [right] = useState(words.map(w => ({ id: w.id, text: w.en })).sort(() => Math.random() - 0.5));
  const [selectedLeft, setSelectedLeft] = useState(null);
  const [matched, setMatched] = useState([]);

  function chooseRight(r) {
    if (!selectedLeft) return;

    if (r.id === selectedLeft.id) {
      // correct
      const next = [...matched, r.id];
      setMatched(next);
      setSelectedLeft(null);

      if (next.length === words.length) onComplete();

    } else {
      // incorrect
      setSelectedLeft(null);
    }
  }

  return (
    <div>
      <h3>Match the pairs</h3>

      <div style={{ display: "flex", gap: 30 }}>
        <div>
          {left.map(l => (
            <div
              key={l.id}
              onClick={() => setSelectedLeft(l)}
              style={{
                padding: 6,
                opacity: matched.includes(l.id) ? 0.3 : 1,
                background: selectedLeft?.id === l.id ? "#ddd" : "none",
                cursor: "pointer"
              }}
            >
              {l.text}
            </div>
          ))}
        </div>

        <div>
          {right.map(r => (
            <div
              key={r.id}
              onClick={() => chooseRight(r)}
              style={{
                padding: 6,
                opacity: matched.includes(r.id) ? 0.3 : 1,
                cursor: "pointer"
              }}
            >
              {r.text}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
