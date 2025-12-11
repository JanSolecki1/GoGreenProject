import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import LogoHeader from "../components/LogoHeader";

const slides = [
  {
    title: "Learn Danish the Smart Way",
    text: "Master the most useful Danish words through short, simple and effective learning sessions"
  },
  {
    title: "Pick your Learning Words",
    text: "You can select 10 words you want to learn today. These are used in mini-games"
  },
  {
    title: "Grow Your Daily Streak",
    text: "Complete a session each day to build momentum, stay consistent, and expand your vocabulary effortlessly"
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
    <>
      <LogoHeader />

      <div className="page" style={{ textAlign: "center", paddingTop: 90 }}>
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
    </>
  );
}
