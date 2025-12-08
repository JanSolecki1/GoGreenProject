// src/pages/GameFlow.jsx
import React, { useEffect, useState } from "react";
import MultipleChoiceGame from "../components/MultipleChoiceGame";
import MatchingGame from "../components/MatchingGame";
import MissingLetterGame from "../components/MissingLetterGame";
import SuccessAnimation from "../components/SuccessAnimation";
import { supabase } from "../utils/supabase";
import { useNavigate } from "react-router-dom";

export default function GameFlow() {
  const [toVerify, setToVerify] = useState([]);
  const [stage, setStage] = useState(1); // 1..3
  const [stageCompleted, setStageCompleted] = useState(false);
  const [showSuccessAnim, setShowSuccessAnim] = useState(false);
  const [allSaved, setAllSaved] = useState(false);
  const nav = useNavigate();

  useEffect(() => {
    loadToVerify();
  }, []);

  async function loadToVerify() {
    const { data: sessionData } = await supabase.auth.getUser();
    const user = sessionData?.user;
    if (!user) {
      console.warn("No user for GameFlow");
      return;
    }

    // fetch user's to_verify with joined words
    const { data, error } = await supabase
      .from("user_to_verify")
      .select("id, word_id, words(*)")
      .eq("user_id", user.id);

    if (error) {
      console.error("Error loading to_verify:", error);
      setToVerify([]);
      return;
    }

    // data: array of { id, word_id, words: { id, da, en } }
    const words = (data || []).map(r => r.words).filter(Boolean);
    setToVerify(words);
  }

  function handleStageComplete() {
    setStageCompleted(true);
  }

  async function finishAndSave() {
    // save known words (user_known_words), delete user_to_verify, update streak, show animation
    const { data: sessionData } = await supabase.auth.getUser();
    const user = sessionData?.user;
    if (!user) {
      console.warn("No user for saving");
      setAllSaved(true);
      return;
    }
    const inserts = (toVerify || []).map(w => ({ user_id: user.id, word_id: w.id }));
    const { error: insErr } = await supabase.from("user_known_words").insert(inserts);
    if (insErr) console.error("Insert known words error:", insErr);

    // delete user_to_verify entries for user
    const { error: delErr } = await supabase.from("user_to_verify").delete().eq("user_id", user.id);
    if (delErr) console.error("Deleting user_to_verify error:", delErr);

    // update streak
    await updateStreak(user.id);

    // show success animation then go to summary
    setShowSuccessAnim(true);
  }

  async function updateStreak(userId) {
    const today = new Date().toISOString().slice(0, 10);
    const { data } = await supabase.from("user_streak").select("*").eq("user_id", userId).single();
    if (!data) {
      await supabase.from("user_streak").insert({ user_id: userId, streak_days: 1, last_played_date: today });
    } else {
      if (data.last_played_date !== today) {
        await supabase.from("user_streak").update({
          streak_days: data.streak_days + 1,
          last_played_date: today
        }).eq("user_id", userId);
      }
    }
  }

  // after animation done, mark allSaved and show final screen
  function onAnimationDone() {
    setShowSuccessAnim(false);
    setAllSaved(true);
  }

  if (showSuccessAnim) {
    return <SuccessAnimation wordsCount={toVerify.length} onDone={onAnimationDone} />;
  }

  if (allSaved) {
    return (
      <div style={{ padding: 20 }}>
        <h2>Success — verified!</h2>
        <p>{toVerify.length} words added to Known Words.</p>
        <div style={{ marginTop: 12 }}>
          <button onClick={() => nav("/progress")}>See progress</button>
          <button style={{ marginLeft: 8 }} onClick={() => nav("/words")}>Practice more</button>
        </div>
      </div>
    );
  }

  if (!toVerify || toVerify.length === 0) {
    return (
      <div style={{ padding: 20 }}>
        <h2>No words to verify</h2>
        <p>Go to /words and swipe RIGHT on 10 words to verify them.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Mini games — stage {stage} / 3</h2>

      {stage === 1 && <MultipleChoiceGame words={toVerify} onComplete={handleStageComplete} />}
      {stage === 2 && <MatchingGame words={toVerify} onComplete={handleStageComplete} />}
      {stage === 3 && <MissingLetterGame words={toVerify} onComplete={handleStageComplete} />}

      <div style={{ marginTop: 12 }}>
        {!stageCompleted ? (
          <div>Complete the game to unlock Next</div>
        ) : (
          <>
            {stage < 3 ? (
              <button onClick={() => { setStage(s => s + 1); setStageCompleted(false); }}>Next game</button>
            ) : (
              <button onClick={() => finishAndSave()}>Finish & Save</button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
