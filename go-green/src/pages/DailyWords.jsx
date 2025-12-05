import React, { useEffect, useState } from 'react'
import WordCard from '../components/WordCard'
import { getLearnedWords, addLearnedWord } from '../utils/storage'


import wordsData from '../data/words.json'


export default function DailyWords() {
// For prototype: first 10 words
const [words, setWords] = useState([])
const [learned, setLearned] = useState(getLearnedWords())


useEffect(() => {
const todays = wordsData.slice(0, 10)
setWords(todays)
}, [])


function handleMark(id) {
addLearnedWord(id)
setLearned(getLearnedWords())
}


return (
<div style={{ padding: 20 }}>
<h2>Today's words</h2>
<div>
{words.map(w => (
<WordCard key={w.id} word={w} onMarkLearned={handleMark} learned={learned.includes(w.id)} />
))}
</div>
<div style={{ marginTop: 12 }}>
<a href="/game">Start Mini-Game</a>
</div>
</div>
)
}