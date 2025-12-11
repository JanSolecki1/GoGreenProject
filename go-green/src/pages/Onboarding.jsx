import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const slides = [
  {
    title: "Learn Danish Fast",
    text: "This application will help you learn the most commonly used Danish words."
  },
  {
    title: "Choose Your 10 Words",
    text: "Pick 10 words you want to learn. These are used in mini-games."
  },
  {
    title: "Build Your Streak",
    text: "Finish the games, add words to your Known List, and grow your daily learning streak."
  }
];

export default function Onboarding() {
  const [step, setStep] = useState(0);
  const nav = useNavigate();

  function next() {
    if (step < slides.length - 1) {
      setStep(step + 1);
    } else {
      nav("/login");
    }
  }

  return (
    <div className="page" style={{ textAlign: "center" }}>
      <h2>{slides[step].title}</h2>

      <div className="card" style={{ marginTop: 20 }}>
        <p style={{ fontSize: 16 }}>{slides[step].text}</p>
      </div>

      <button className="btn btn-primary" onClick={next} style={{ marginTop: 30 }}>
        {step === slides.length - 1 ? "Start" : "Next"}
      </button>

      <p className="meta" style={{ marginTop: 10 }}>
        {step + 1} / {slides.length}
      </p>
    </div>
  );
}
