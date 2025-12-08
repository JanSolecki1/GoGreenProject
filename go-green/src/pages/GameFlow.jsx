import React, { useEffect, useState } from "react";
import MatchingGame from "../components/MatchingGame";
import MissingLettersGame from "../components/MissingLettersGame";
import MultipleChoiceGame from "../components/MultipleChoiceGame";
import { supabase } from "../utils/supabase";
import { useNavigate } from "react-router-dom";

export default function GameFlow() {
  const [toVerify, setToVerify] = useState([]);
  const [failed, setFailed] = useState([]); // word ids that failed any game
  const [stage, setStage] = useState(1); // 1..3
  const [results, setResults] = useState({}); // { wordId: {match:bool, missing:bool, mc:bool} }
  const [showSummary, setShowSummary] = useState(false);
  const nav = useNavigate();

  useEffect(() => {
    const raw = sessionStorage.getItem("toVerifyWords");
    const arr = raw ? JSON.parse(raw) : [];
    setToVerify(arr);
  }, []);

  function registerResult(wordId, gameKey, ok) {
    setResults(prev => {
      const cur = prev[wordId] || {};
      return { ...prev, [wordId]: { ...cur, [gameKey]: ok } };
    });
  }

  function nextStage() {
    if (stage < 3) {
      setStage(s => s + 1);
    } else {
      // finish all games -> evaluate
      evaluateResults();
    }
  }

  function evaluateResults() {
    const failedIds = [];
    toVerify.forEach(w => {
      const res = results[w.id] || {};
      // word must pass all three: match, missing, mc
      if (!(res.match && res.missing && res.mc)) {
        failedIds.push(w.id);
      }
    });
    setFailed(failedIds);
    setShowSummary(true);
    if (failedIds.length === 0) {
      saveProgress(toVerify.map(w => w.id));
    }
  }

  async function saveProgress(wordIds) {
    // insert progress records with user context
    const { data: sessionData } = await supabase.auth.getUser();
    const user = sessionData?.user;
    if (!user) {
      console.warn("No user session when saving progress");
      return;
    }
    const inserts = wordIds.map(id => ({ user_id: user.id, word_id: id }));
    const { error } = await supabase.from("progress").insert(inserts);
    if (error) console.error(error);
    else {
      // update streak
      await updateStreak(user.id);
    }
  }

  async function updateStreak(userId) {
    // minimal streak logic: if last_played_date != today -> increment, else do nothing
    const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
    const { data } = await supabase.from("user_streak").select("*").eq("user_id", userId).single();
    if (!data) {
      // create
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

  function handlePlayAgain() {
    // if success -> offer play again with known words; we'll just navigate to Progress or reload
    nav("/progress");
  }

  if (!toVerify) return <div style={{ padding: 20 }}>Loading...</div>;

  if (!showSummary) {
    return (
      <div style={{ padding: 20 }}>
        <h2>Mini games — stage {stage} / 3</h2>

        {stage === 1 && <MatchingGame words={toVerify} registerResult={registerResult} />}
        {stage === 2 && <MissingLettersGame words={toVerify} registerResult={registerResult} />}
        {stage === 3 && <MultipleChoiceGame words={toVerify} registerResult={registerResult} />}

        <div style={{ marginTop: 12 }}>
          <button onClick={nextStage}>Next game</button>
        </div>
      </div>
    );
  }

  // summary
  return (
    <div style={{ padding: 20 }}>
      <h2>Summary</h2>
      {failed.length === 0 ? (
        <>
          <div>Congratulations — all words verified! ✅</div>
          <div style={{ marginTop: 12 }}>
            <button onClick={handlePlayAgain}>See progress / Play again</button>
          </div>
        </>
      ) : (
        <>
          <div>Some words need more practice:</div>
          <ul>
            {failed.map(id => {
              const w = toVerify.find(x => x.id === id);
              return <li key={id}>{w ? `${w.da} — ${w.en}` : id}</li>;
            })}
          </ul>
          <div style={{ marginTop: 12 }}>
            <button onClick={() => {
              // Put failed words back into session and restart flow for them
              const failedWords = toVerify.filter(w => failed.includes(w.id));
              sessionStorage.setItem("toVerifyWords", JSON.stringify(failedWords));
              setResults({});
              setFailed([]);
              setShowSummary(false);
              setStage(1);
            }}>Retry failed words</button>
            <button style={{ marginLeft: 8 }} onClick={() => nav("/progress")}>Go to progress</button>
          </div>
        </>
      )}
    </div>
  );
}
