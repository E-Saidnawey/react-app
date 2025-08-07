import { useState } from 'react'
import Heatmap from './pages/heatmap.tsx'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
	<div className="p-6">
	      <h1 className="text-2xl font-bold mb-4">Sensor Heatmap</h1>
	      <Heatmap />
	      <div className="text-blue-600 text-3xl font-bold !text-blue-600">Tailwind v4 is working!</div>
	      <div className="p-4 bg-green-200 text-center text-red-600 text-xl font-bold">
  		This should be RED text on a light green background
	      </div>

        </div>
  )
}

export default App
