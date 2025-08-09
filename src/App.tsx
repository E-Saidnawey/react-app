import { useState } from 'react'
import Heatmap from './pages/heatmap.tsx'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
	<div className="p-6">
	      <h1 className="text-2xl font-bold mb-4">Sensor Heatmap</h1>
	      <Heatmap />
        </div>
  )
}

export default App
