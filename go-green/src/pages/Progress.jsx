import React, { useEffect, useState } from "react"
import { supabase } from "../utils/supabase"
import { getLearnedWords } from "../utils/storage"

export default function Progress() {
  const [words, setWords] = useState([])

  useEffect(() => {
    loadProgress()
  }, [])

  async function loadProgress() {
    const learnedIds = await getLearnedWords()

    if (learnedIds.length === 0) {
      setWords([])
      return
    }

    const { data } = await supabase
      .from("words")
      .select("*")
      .in("id", learnedIds)

    setWords(data)
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Progress</h2>
      <div>Words learned: {words.length}</div>

      <ul>
        {words.map(w => (
          <li key={w.id}>{w.da} — {w.en}</li>
        ))}
      </ul>
    </div>
  )
}
