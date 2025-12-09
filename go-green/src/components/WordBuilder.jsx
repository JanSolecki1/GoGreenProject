import React, { useEffect, useState } from "react";

/*
WordBuilder
- words: array of {id, da, en}
- onComplete: callback when all queue finished
Behavior:
- For each word we split Danish word into 2 or 3 fragments.
- Display fragments pool (correct fragments mixed with distractors from other words).
- User taps fragments to build the word (appends).
- If the partial build does not match prefix of target → "Incorrect" and move to next word.
- If full build equals target -> correct -> next word.
*/

function splitIntoFragments(word) {
  // crude but solid: split into 2 or 3 parts depending on length
  const w = word;
  const len = w.length;
  if (len <= 4) {
    const mid = Math.ceil(len / 2);
    return [w.slice(0, mid), w.slice(mid)];
  }
  // for longer words pick 2 or 3 parts
  if (len <= 7) {
    const a = Math.ceil(len / 3);
    const b = Math.ceil((len - a) / 2);
    return [w.slice(0, a), w.slice(a, a + b), w.slice(a + b)];
  } else {
    const a = Math.ceil(len / 3);
    const b = Math.ceil(len / 3);
    return [w.slice(0, a), w.slice(a, a + b), w.slice(a + b)];
  }
}

export default function WordBuilder({ words = [], onComplete }) {
  const [queue, setQueue] = useState([]);
  const [current, setCurrent] = useState(null);
  const [fragmentsPool, setFragmentsPool] = useState([]);
  const [built, setBuilt] = useState("");
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    if (!words || words.length === 0) {
      setQueue([]);
      setCurrent(null);
      return;
    }
    const q = [...words].sort(() => Math.random() - 0.5);
    setQueue(q);
    setCurrent(q[0]);
  }, [words]);

  useEffect(() => {
    if (!current) return;
    prepareFragments(current);
    setBuilt("");
    setFeedback("");
    // eslint-disable-next-line
  }, [current]);

  function prepareFragments(word) {
    // correct fragments
    const frags = splitIntoFragments(word.da);
    // collect distractor fragments from other words
    const others = words.filter(w => w.id !== word.id);
    const distractors = [];
    for (let i = 0; i < Math.min(6, others.length); i++) {
      const pick = others[Math.floor(Math.random() * others.length)];
      const sf = splitIntoFragments(pick.da);
      // take a random fragment from that word
      const frag = sf[Math.floor(Math.random() * sf.length)];
      if (frag && frag.length > 0 && !distractors.includes(frag) && !frags.includes(frag)) {
        distractors.push(frag);
      }
    }
    const pool = [...frags, ...distractors].sort(() => Math.random() - 0.5);
    setFragmentsPool(pool);
  }

  function pickFragment(f) {
    if (!current) return;
    const candidate = built + f;

    // quick normalization (lowercase)
    const normTarget = current.da;
    const normCandidate = candidate;

    // if candidate is not prefix of target => incorrect
    if (!normTarget.startsWith(normCandidate)) {
      // incorrect -> show feedback and go to next word
      setFeedback("Incorrect — moving to next word");
      setTimeout(() => {
        setFeedback("");
        goToNext(true);
      }, 600);
      return;
    }

    // valid prefix -> accept fragment
    setBuilt(candidate);

    // if completed exactly -> correct
    if (candidate === normTarget) {
      setFeedback("Correct!");
      setTimeout(() => {
        setFeedback("");
        goToNext(false); // success
      }, 350);
    }
  }

  function goToNext(afterWrong = false) {
    // remove current from queue (always remove head)
    const newQueue = queue.slice(1);
    if (newQueue.length === 0) {
      onComplete();
      return;
    }
    setQueue(newQueue);
    setCurrent(newQueue[0]);
  }

  if (!current) return <div>No words to build.</div>;

  return (
    <div>
      <h2>Word Builder</h2>
      <p style={{ marginTop: 8 }}>Build the Danish word by tapping fragments.</p>

      <div style={{ marginTop: 16 }}>
        <div style={{ fontSize: 24, marginBottom: 12 }}>{built || "—"}</div>
        <div style={{ fontSize: 20, marginBottom: 8, color: "#666" }}>Meaning: {current.en}</div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 12 }}>
          {fragmentsPool.map((f, i) => (
            <button
              key={i}
              onClick={() => pickFragment(f)}
              style={{ padding: 14, fontSize: 18 }}
            >
              {f}
            </button>
          ))}
        </div>

        <div style={{ height: 30, marginTop: 12 }}>
          {feedback && <strong>{feedback}</strong>}
        </div>
      </div>
    </div>
  );
}
