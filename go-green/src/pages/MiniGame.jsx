import React, { useState, useEffect } from "react"
import MatchGame from "../components/MatchGame"
import { addLearnedWord } from "../utils/storage"
import { supabase } from "../utils/supabase"
import { useNavigate } from "react-router-dom"

export default function MiniGame() {
  const [words, setWords] = useState([])
  const nav = useNavigate()

  useEffect(() => {
    loadWords()
  }, [])

  async function loadWords() {
    const { data } = await supabase
      .from("words")
      .select("*")
      .order("id")
      .limit(10)

    setWords(data)
  }

  async function handleFinish(ids) {
    for (const id of ids) {
      await addLearnedWord(id)
    }
    nav("/progress")
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Word Match</h2>
      <MatchGame words={words} onFinish={handleFinish} />
    </div>
  )
}
