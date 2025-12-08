// src/components/MissingLetterGame.jsx
import React, { useEffect, useState } from "react";
import { shuffle } from "../utils/shuffle";

function maskOneLetter(word) {
  if (!word) return { masked: word, idx: -1, correctChar: "" };
  const n = word.length;
  if (n <= 2) {
    const idx = 1;
    return { masked: word.slice(0, idx) + "_" + word.slice(idx + 1), idx, correctChar: word[idx] };
  }
  const idx = Math.floor(Math.random() * (n - 2)) + 1;
  return { masked: word.slice(0, idx) + "_" + word.slice(idx + 1), idx, correctChar: word[idx] };
}

function makeOptions(correctChar) {
  const letters = "aeiouyæøåabcdefghijklmnopqrstuvwxyz".split("");
  let opts = new Set();
  opts.add(correctChar);
  while (opts.size < 3) {
    const pick = letters[Math.floor(Math.random() * letters.length)];
    opts.add(pick);
  }
  return shuffle(Array.from(opts));
}

export default function MissingLetterGame({ words = [], onComplete }) {
  const [queue, setQueue] = useState([]);
  const [index, setIndex] = useState(0);
  const [maskedInfo, setMaskedInfo] = useState(null);
  const [options, setOptions] = useState([]);
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    if (words && words.length > 0) {
      setQueue(words.slice());
      setIndex(0);
    }
  }, [words]);

  useEffect(() => {
    if (!queue) return;
    if (queue.length === 0) {
      if (onComplete) onComplete();
      return;
    }
    if (queue[index]) {
      const info = maskOneLetter(queue[index].da);
      setMaskedInfo(info);
      setOptions(makeOptions(info.correctChar));
      setFeedback(null);
    }
    // eslint-disable-next-line
  }, [queue, index]);

  function pickLetter(ch) {
    const current = queue[index];
    const ok = ch === maskedInfo.correctChar;
    if (ok) {
      setFeedback("correct");
      setQueue(prev => {
        const q = prev.slice();
        q.splice(index, 1);
        return q;
      });
      setIndex(0);
    } else {
      setFeedback("incorrect");
      setQueue(prev => {
        const q = prev.slice();
        const item = q.splice(index, 1)[0];
        q.push(item);
        return q;
      });
      setIndex(prev => (prev >= (queue.length - 1) ? 0 : prev));
    }
    setTimeout(() => setFeedback(null), 500);
  }

  if (!queue || queue.length === 0) return <div>Preparing...</div>;
  if (!maskedInfo) return <div>Preparing...</div>;

  const current = queue[index];

  return (
    <div>
      <h3>Missing letter</h3>
      <div style={{ fontSize: 20 }}>{maskedInfo.masked}</div>
      <div style={{ marginTop: 8 }}>
        {options.map((opt, i) => (
          <button key={i} onClick={() => pickLetter(opt)} style={{ marginRight: 8 }}>{opt}</button>
        ))}
      </div>
      <div style={{ marginTop: 8 }}>
        {feedback === "correct" && <span>Correct ✅</span>}
        {feedback === "incorrect" && <span>Incorrect — will repeat later</span>}
      </div>
      <div style={{ marginTop: 8 }}>Remaining: {queue.length}</div>
    </div>
  );
}
