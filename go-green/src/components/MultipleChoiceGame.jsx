import React, { useEffect, useState } from "react";
import { supabase } from "../utils/supabase";
import { shuffle } from "../utils/shuffle";

export default function MultipleChoiceGame({ words = [], registerResult }) {
  const [index, setIndex] = useState(0);
  const [options, setOptions] = useState([]);

  useEffect(() => {
    if (words.length > 0) {
      setIndex(0);
      prepareOptions(0);
    }
  }, [words]);

  async function prepareOptions(i) {
    const correct = words[i];
    // fetch 2 distractors from DB (random different ids)
    const { data } = await supabase
      .from("words")
      .select("*")
      .neq("id", correct.id)
      .limit(3);

    const pool = data ? data.map(d => ({ id: d.id, en: d.en, da: d.da })) : [];
    const candidates = shuffle([correct, ...pool]).slice(0, Math.min(4, 1 + pool.length));
    setOptions(shuffle(candidates));
  }

  function pick(opt) {
    const ok = opt.id === words[index].id;
    registerResult(words[index].id, "mc", ok);
    if (index + 1 < words.length) {
      setIndex(i => i + 1);
      prepareOptions(index + 1);
    }
  }

  if (!words || words.length === 0) return <div>Loading...</div>;
  if (index >= words.length) return <div>Completed multiple choice</div>;

  return (
    <div>
      <h3>Multiple choice</h3>
      <div>
        <div><strong>{words[index].en}</strong></div>
        <div style={{ marginTop: 8 }}>
          {options.map(opt => (
            <div key={opt.id} style={{ marginBottom: 6 }}>
              <button onClick={() => pick(opt)}>{opt.da}</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
