import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Resume from './pages/Resume';
import Analysis from './pages/Analysis';
import PlantMonitor from './pages/PlantMonitor';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Resume />} />
          <Route path="analysis" element={<Analysis />} />
          <Route path="plants" element={<PlantMonitor />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
