import React, { useState } from "react";

export default function MissingLetterGame({ words, onComplete }) {
  const [index, setIndex] = useState(0);
  const [feedback, setFeedback] = useState("");

  const current = words[index];

  function hideLetter(word) {
    const pos = Math.floor(Math.random() * word.length);
    return word.substring(0, pos) + "_" + word.substring(pos + 1);
  }

  function generateOptions(word) {
    const missingIndex = word.indexOf("_");
    const correct = current.da[missingIndex];

    const alphabet = "abcdefghijklmnopqrstuvwxyzæøå";
    const wrong1 = alphabet[Math.floor(Math.random() * alphabet.length)];
    const wrong2 = alphabet[Math.floor(Math.random() * alphabet.length)];

    return [correct, wrong1, wrong2].sort(() => Math.random() - 0.5);
  }

  const hidden = hideLetter(current.da);
  const options = generateOptions(hidden);

  function choose(letter) {
    const missingIndex = hidden.indexOf("_");

    if (letter === current.da[missingIndex]) {
      setFeedback("Correct!");

      if (index + 1 < words.length) {
        setTimeout(() => {
          setFeedback("");
          setIndex(i => i + 1);
        }, 400);
      } else {
        onComplete();
      }
    } else {
      setFeedback("Wrong");
    }
  }

  return (
    <div>
      <h3>Fill in the missing letter</h3>

      <h2>{hidden}</h2>

      {options.map((l, i) => (
        <button 
          key={i} 
          onClick={() => choose(l)}
          style={{ margin: 6 }}
        >
          {l}
        </button>
      ))}

      <p>{feedback}</p>
    </div>
  );
}
