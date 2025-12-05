import React from 'react'
import { getLearnedWords } from '../utils/storage'
import wordsData from '../data/words.json'


export default function Progress() {
const learned = getLearnedWords()
const learnedWords = wordsData.filter(w => learned.includes(w.id))


return (
<div style={{ padding: 20 }}>
<h2>Progress</h2>
<div>Words learned: {learned.length}</div>
<ul>
{learnedWords.map(w => (
<li key={w.id}>{w.da} — {w.en}</li>
))}
</ul>
</div>
)
}