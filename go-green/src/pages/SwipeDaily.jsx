// src/pages/SwipeDaily.jsx
import React, { useEffect, useState } from "react";
import { supabase } from "../utils/supabase";
import { useNavigate } from "react-router-dom";


export default function SwipeDaily() {
  const [words, setWords] = useState([]);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const nav = useNavigate();

  useEffect(() => {
    loadRandomUnknown();
  }, []);

  async function loadRandomUnknown() {
    setLoading(true);
    const { data: sessionData } = await supabase.auth.getUser();
    const user = sessionData?.user;
    const userId = user?.id ?? null;

    // Step 1: get known ids for user
    let knownIds = [];
    if (userId) {
      const { data: known } = await supabase
        .from("user_known_words")
        .select("word_id")
        .eq("user_id", userId);
      knownIds = known ? known.map(r => r.word_id) : [];
    }

    // Step 2: fetch 10 random words excluding knownIds
    let query;

if (knownIds.length === 0) {
  // No known words yet — get ANY random 10
  query = supabase
    .from("words")
    .select("*")
    .order("random()")
    .limit(10);
} else {
  // Filter out known words
  query = supabase
    .from("words")
    .select("*")
    .not("id", "in", `(${knownIds.join(",")})`)
    .order("random()")
    .limit(10);
}


    const { data, error } = await query;
    if (error) {
      console.error("Error loading words:", error);
      setWords([]);
    } else {
      setWords(data || []);
    }
    setLoading(false);
  }

  async function handleKnow() {
    const w = words[index];
    if (!w) return;

    const { data: sessionData } = await supabase.auth.getUser();
    const user = sessionData?.user;
    if (!user) {
      alert("No user session");
      return;
    }

    // Insert into user_to_verify (if not already present)
    await supabase
      .from("user_to_verify")
      .insert([{ user_id: user.id, word_id: w.id }])
      .select();

    // check how many toVerify the user has now
    const { data: tv } = await supabase
      .from("user_to_verify")
      .select("id")
      .eq("user_id", user.id);

    nextIndex();

    if (tv && tv.length >= 10) {
      // we have 10 or more -> go to game
      // small delay to let state settle
      setTimeout(() => nav("/game"), 200);
    }
  }

  async function handleNotYet() {
    nextIndex();
  }

  function nextIndex() {
    if (index + 1 < words.length) {
      setIndex(i => i + 1);
    } else {
      // finished swiping the 10 shown: either user already wrote toVerify to db, or not enough rights
      // If user had less than 10 rights, we still go to /game — GameFlow will read current user_to_verify
      setTimeout(() => nav("/game"), 150);
    }
  }

  if (loading) return <div style={{ padding: 20 }}>Loading words...</div>;
  if (!words || words.length === 0) return <div style={{ padding: 20 }}>No words available.</div>;

  const current = words[index];

  return (
    <div style={{ padding: 20 }}>
      <h2>Today's words — swipe</h2>

      <div style={{ marginTop: 20 }}>
        <div><strong style={{ fontSize: 22 }}>{current.da}</strong></div>
        <div style={{ color: "#666" }}>{current.en}</div>

        <div style={{ marginTop: 12 }}>
          <button onClick={handleNotYet} style={{ marginRight: 10 }}>Not yet (left)</button>
          <button onClick={handleKnow}>I know (right)</button>
        </div>

        <div style={{ marginTop: 12 }}>{index + 1} / {words.length}</div>
      </div>
    </div>
  );
}
