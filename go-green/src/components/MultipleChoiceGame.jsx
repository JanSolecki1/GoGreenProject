import React, { useState } from "react";

export default function MultipleChoiceGame({ words, onComplete }) {
  const [index, setIndex] = useState(0);
  const [feedback, setFeedback] = useState("");

  const current = words[index];

  function randomOptions(correct) {
    const wrong = words.filter(w => w.id !== correct.id);
    const choices = [
      correct.en,
      wrong[Math.floor(Math.random() * wrong.length)].en,
      wrong[Math.floor(Math.random() * wrong.length)].en,
    ];

    return choices.sort(() => Math.random() - 0.5);
  }

  const options = randomOptions(current);

  function checkAnswer(answer) {
    if (answer === current.en) {
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
      setFeedback("Try again");
    }
  }

  return (
    <div>
      <h3>Choose the correct translation</h3>
      <h2>{current.da}</h2>

      {options.map((opt, i) => (
        <button 
          key={i} 
          onClick={() => checkAnswer(opt)}
          style={{ display: "block", margin: "8px 0" }}
        >
          {opt}
        </button>
      ))}

      <p>{feedback}</p>
    </div>
  );
}
