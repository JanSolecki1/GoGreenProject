import { Routes, Route } from 'react-router-dom'
import Splash from './pages/Splash.jsx'
import DailyWords from './pages/DailyWords.jsx'
import MiniGame from './pages/MiniGame.jsx'
import Progress from './pages/Progress.jsx'
import Settings from './pages/Settings.jsx'
import NavBar from './components/NavBar.jsx'

function App() {
  return (
<div> 
  <NavBar /> 
  <Routes> 
    <Route path="/" element={<Splash />} /> 
    <Route path="/words" element={<DailyWords />} /> 
    <Route path="/game" element={<MiniGame />} /> 
    <Route path="/progress" element={<Progress />} /> 
    <Route path="/settings" element={<Settings />} /> 
    </Routes> 
</div>
  )
}

export default App