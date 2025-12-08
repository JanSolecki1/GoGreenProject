// src/components/MultipleChoiceGame.jsx
import React, { useEffect, useState } from "react";
import { supabase } from "../utils/supabase";
import { shuffle } from "../utils/shuffle";

export default function MultipleChoiceGame({ words = [], onComplete }) {
  const [queue, setQueue] = useState([]);
  const [index, setIndex] = useState(0);
  const [options, setOptions] = useState([]);
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    if (words && words.length > 0) {
      setQueue(words.slice());
      setIndex(0);
      setFeedback(null);
    }
  }, [words]);

  useEffect(() => {
    if (!queue) return;
    if (queue.length === 0) {
      if (onComplete) onComplete();
      return;
    }
    prepareOptions(index);
    // eslint-disable-next-line
  }, [queue, index]);

  async function prepareOptions(i) {
    if (!queue[i]) return;
    const correct = queue[i];
    const { data } = await supabase
      .from("words")
      .select("id,da,en")
      .neq("id", correct.id)
      .limit(3);

    const pool = data ? data : [];
    const poolItems = pool.map(p => ({ id: p.id, da: p.da, en: p.en }));
    const choices = shuffle([ { id: correct.id, da: correct.da, en: correct.en }, ...poolItems ]).slice(0, Math.min(4, 1 + poolItems.length));
    setOptions(shuffle(choices));
  }

  function pick(opt) {
    const correct = queue[index];
    if (opt.id === correct.id) {
      setFeedback("correct");
      // remove current from queue
      setQueue(prev => {
        const q = prev.slice();
        q.splice(index, 1);
        return q;
      });
      setIndex(0);
      setTimeout(() => setFeedback(null), 500);
    } else {
      setFeedback("incorrect");
      // move current to end
      setQueue(prev => {
        const q = prev.slice();
        const item = q.splice(index, 1)[0];
        q.push(item);
        return q;
      });
      // keep index at same numeric position (next item)
      setIndex(prev => (prev >= (queue.length - 1) ? 0 : prev));
      setTimeout(() => setFeedback(null), 500);
    }
  }

  if (!queue || queue.length === 0) return <div>Preparing...</div>;

  const current = queue[index];

  return (
    <div>
      <h3>Multiple Choice</h3>
      <div><strong>{current.en}</strong></div>
      <div style={{ marginTop: 8 }}>
        {options.map(opt => (
          <div key={opt.id} style={{ marginBottom: 6 }}>
            <button onClick={() => pick(opt)}>{opt.da}</button>
          </div>
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
