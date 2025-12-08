import React, { useEffect, useState } from "react";

function maskWord(word) {
  // mask roughly 30-50% letters (keep first and last)
  if (!word) return "";
  const n = word.length;
  const arr = word.split("");
  for (let i = 1; i < n - 1; i++) {
    if (Math.random() < 0.45) arr[i] = "_";
  }
  return arr.join("");
}

export default function MissingLettersGame({ words = [], registerResult }) {
  const [index, setIndex] = useState(0);
  const [masked, setMasked] = useState("");
  const [input, setInput] = useState("");
  const [correctCount, setCorrectCount] = useState(0);

  useEffect(() => {
    if (words.length > 0) {
      setIndex(0);
    }
  }, [words]);

  useEffect(() => {
    if (words.length > 0 && words[index]) {
      setMasked(maskWord(words[index].da));
      setInput("");
    }
  }, [index, words]);

  function submit() {
    const target = words[index].da.trim().toLowerCase();
    const given = input.trim().toLowerCase();
    const ok = given === target;
    if (ok) setCorrectCount(c => c + 1);
    // register per-word result
    registerResult(words[index].id, "missing", ok);
    if (index + 1 < words.length) setIndex(i => i + 1);
  }

  useEffect(() => {
    // if finished, and all were correct? we already registered per-word
    if (index >= words.length) {
      // nothing else here
    }
  }, [index, words]);

  if (!words || words.length === 0) return <div>Loading...</div>;

  if (index >= words.length) {
    return <div>Completed (answered {correctCount} / {words.length})</div>;
  }

  return (
    <div>
      <h3>Fill missing letters</h3>
      <div>
        <div style={{ fontSize: 20 }}>{masked}</div>
        <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type the full Danish word" />
        <div style={{ marginTop: 8 }}>
          <button onClick={submit}>Submit</button>
        </div>
      </div>
    </div>
  );
}
