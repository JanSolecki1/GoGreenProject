import React, { useEffect, useState } from "react"
import WordCard from "../components/WordCard"
import { getLearnedWords, addLearnedWord } from "../utils/storage"
import { supabase } from "../utils/supabase"

export default function DailyWords() {
  const [words, setWords] = useState([])
  const [learned, setLearned] = useState([])

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    const { data } = await supabase
      .from("words")
      .select("*")
      .order("id")
      .limit(10)

    setWords(data)

    const learnedArr = await getLearnedWords()
    setLearned(learnedArr)
  }

  async function handleMark(id) {
    await addLearnedWord(id)
    setLearned(await getLearnedWords())
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Today's words</h2>
      
      {words.map(w => (
        <WordCard
          key={w.id}
          word={w}
          learned={learned.includes(w.id)}
          onMarkLearned={handleMark}
        />
      ))}

      <div style={{ marginTop: 12 }}>
        <a href="/game">Start Mini-Game</a>
      </div>
    </div>
  )
}
