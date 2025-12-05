import React from 'react'


export default function WordCard({ word, onMarkLearned, learned }) {
return (
<div style={{ padding: 8, border: '1px solid #ddd', marginBottom: 6 }}>
<div><strong>{word.da}</strong></div>
<div>{word.en}</div>
<div>
<button onClick={() => onMarkLearned(word.id)} disabled={learned}>
{learned ? 'Learned' : 'Mark Learned'}
</button>
</div>
</div>
)
}