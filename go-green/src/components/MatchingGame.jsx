// src/components/MatchingGame.jsx
import React, { useEffect, useState } from "react";
import { shuffle } from "../utils/shuffle";

export default function MatchingGame({ words = [], onComplete }) {
  const [left, setLeft] = useState([]);
  const [right, setRight] = useState([]);
  const [selectedL, setSelectedL] = useState(null);
  const [selectedR, setSelectedR] = useState(null);
  const [matched, setMatched] = useState([]);

  useEffect(() => {
    if (words.length > 0) {
      setLeft(shuffle(words.slice()));
      setRight(shuffle(words.slice()));
      setMatched([]);
      setSelectedL(null);
      setSelectedR(null);
    }
  }, [words]);

  useEffect(() => {
    if (matched.length === words.length && words.length > 0) {
      if (onComplete) onComplete();
    }
  }, [matched, words, onComplete]);

  function clickLeft(item) {
    if (matched.includes(item.id)) return;
    setSelectedL(item);
    if (selectedR) tryMatch(item, selectedR);
  }

  function clickRight(item) {
    if (matched.includes(item.id)) return;
    setSelectedR(item);
    if (selectedL) tryMatch(selectedL, item);
  }

  function tryMatch(l, r) {
    if (l.id === r.id) {
      setMatched(prev => [...prev, l.id]);
    } else {
      // incorrect: show nothing, let user try again
    }
    setSelectedL(null);
    setSelectedR(null);
  }

  return (
    <div>
      <h3>Matching game</h3>
      <div style={{ display: "flex", gap: 24 }}>
        <div>
          <h4>Danish</h4>
          {left.map(item => (
            <div key={item.id} onClick={() => clickLeft(item)} style={{ padding: 6, cursor: "pointer", opacity: matched.includes(item.id) ? 0.4 : 1 }}>
              {item.da}
            </div>
          ))}
        </div>

        <div>
          <h4>English</h4>
          {right.map(item => (
            <div key={item.id} onClick={() => clickRight(item)} style={{ padding: 6, cursor: "pointer", opacity: matched.includes(item.id) ? 0.4 : 1 }}>
              {item.en}
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginTop: 12 }}>Matched: {matched.length} / {words.length}</div>
    </div>
  );
}
