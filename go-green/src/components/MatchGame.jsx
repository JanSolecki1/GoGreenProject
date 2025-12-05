import React, { useState, useMemo } from 'react'
import { shuffle } from '../utils/shuffle'


// Simple click-to-match game (select a Danish word, then select translation)
export default function MatchGame({ words, onFinish }) {
const [leftItems, setLeftItems] = useState(() => shuffle(words))
const [rightItems, setRightItems] = useState(() => shuffle(words))
const [selectedLeft, setSelectedLeft] = useState(null)
const [selectedRight, setSelectedRight] = useState(null)
const [matchedIds, setMatchedIds] = useState([])


const pairsCount = matchedIds.length


function handleLeftClick(item) {
if (matchedIds.includes(item.id)) return
setSelectedLeft(item)
if (selectedRight) attemptMatch(item, selectedRight)
}


function handleRightClick(item) {
if (matchedIds.includes(item.id)) return
setSelectedRight(item)
if (selectedLeft) attemptMatch(selectedLeft, item)
}


function attemptMatch(left, right) {
// right.en must match left.en (same id)
if (left.id === right.id) {
setMatchedIds(prev => [...prev, left.id])
setSelectedLeft(null)
setSelectedRight(null)
} else {
// mismatch -> deselect both
setSelectedLeft(null)
setSelectedRight(null)
}
}


const isComplete = pairsCount === words.length


return (
<div>
<div style={{ display: 'flex', gap: 20 }}>
<div>
<h4>Danish</h4>
{leftItems.map(item => (
<div key={item.id} onClick={() => handleLeftClick(item)} style={{ opacity: matchedIds.includes(item.id) ? 0.4 : 1, cursor: 'pointer', padding: 6 }}>
{item.da}
{selectedLeft?.id === item.id ? ' ←' : ''}
</div>
))}
</div>
<div>
<h4>English</h4>
{rightItems.map(item => (
<div key={item.id} onClick={() => handleRightClick(item)} style={{ opacity: matchedIds.includes(item.id) ? 0.4 : 1, cursor: 'pointer', padding: 6 }}>
{item.en}
{selectedRight?.id === item.id ? ' ←' : ''}
</div>
))}
</div>
</div>


<div style={{ marginTop: 12 }}>
<div>Matches: {pairsCount} / {words.length}</div>
{isComplete && (
<div>
<button onClick={() => onFinish(matchedIds)}>Finish — Save Learned</button>
</div>
)}
</div>
</div>)
}