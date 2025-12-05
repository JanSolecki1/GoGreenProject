import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'


export default function Splash() {
const nav = useNavigate()
useEffect(() => {
const t = setTimeout(() => nav('/words'), 800)
return () => clearTimeout(t)
}, [nav])


return (
<div style={{ padding: 20 }}>
<h1>Calm Danish</h1>
<p>Relaxed 10 words per day — prototype</p>
</div>
)
}