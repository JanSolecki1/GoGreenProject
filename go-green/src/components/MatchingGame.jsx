import React, { useEffect, useState } from "react";
import { shuffle } from "../utils/shuffle";

export default function MatchingGame({ words = [], registerResult }) {
  const [left, setLeft] = useState([]);
  const [right, setRight] = useState([]);
  const [selectedL, setSelectedL] = useState(null);
  const [selectedR, setSelectedR] = useState(null);
  const [matched, setMatched] = useState([]);

  useEffect(() => {
    if (words.length > 0) {
      setLeft(shuffle(words));
      setRight(shuffle(words));
      setMatched([]);
      setSelectedL(null);
      setSelectedR(null);
    }
  }, [words]);

  function tryMatch() {
    if (!selectedL || !selectedR) return;
    if (selectedL.id === selectedR.id) {
      setMatched(prev => [...prev, selectedL.id]);
    }
    setSelectedL(null);
    setSelectedR(null);
  }

  // When completed, register per-word results (true/false)
  useEffect(() => {
    if (matched.length === words.length && words.length > 0) {
      // register all as passed
      words.forEach(w => registerResult(w.id, "match", true));
    }
  }, [matched]);

  return (
    <div>
      <h3>Matching game</h3>
      <div style={{ display: "flex", gap: 20 }}>
        <div>
          <h4>Danish</h4>
          {left.map(item => (
            <div key={item.id} onClick={() => { if (!matched.includes(item.id)) setSelectedL(item); tryMatch(); }} style={{ padding: 6, cursor: "pointer", opacity: matched.includes(item.id) ? 0.4 : 1 }}>
              {item.da} {selectedL?.id === item.id ? "←" : ""}
            </div>
          ))}
        </div>
        <div>
          <h4>English</h4>
          {right.map(item => (
            <div key={item.id} onClick={() => { if (!matched.includes(item.id)) setSelectedR(item); tryMatch(); }} style={{ padding: 6, cursor: "pointer", opacity: matched.includes(item.id) ? 0.4 : 1 }}>
              {item.en} {selectedR?.id === item.id ? "←" : ""}
            </div>
          ))}
        </div>
      </div>
      <div style={{ marginTop: 12 }}>
        <div>Matched: {matched.length} / {words.length}</div>
      </div>
    </div>
  );
}
