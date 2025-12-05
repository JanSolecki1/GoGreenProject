import React from 'react'
import { Link, useLocation } from 'react-router-dom'

export default function NavBar() {
const loc = useLocation()
return (
<nav style={{ padding: 8 }}>
<Link to="/">Splash</Link> |{' '}
<Link to="/words">Daily Words</Link> |{' '}
<Link to="/game">Mini Game</Link> |{' '}
<Link to="/progress">Progress</Link> |{' '}
<Link to="/settings">Settings</Link>
<div style={{ fontSize: 12, marginTop: 6 }}>Current: {loc.pathname}</div>
</nav>
)
}