import React, { useState, useEffect } from 'react'
import MatchGame from '../components/MatchGame'
import { addLearnedWord, getLearnedWords } from '../utils/storage'
import wordsData from '../data/words.json'
import { useNavigate } from 'react-router-dom'


export default function MiniGame() {
const [words, setWords] = useState([])
const nav = useNavigate()


useEffect(() => {
setWords(wordsData.slice(0, 10))
}, [])


function handleFinish(matchedIds) {
// Mark matchedIds as learned
matchedIds.forEach(id => addLearnedWord(id))
// small delay then navigate to progress
setTimeout(() => {
nav('/progress')
}, 300)
}


return (
<div style={{ padding: 20 }}>
<h2>Word Match</h2>
<p>Select a Danish word, then select the English translation.</p>
<MatchGame words={words} onFinish={handleFinish} />
</div>
)
}