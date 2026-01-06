import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Resume from './pages/Resume';
import Analysis from './pages/Analysis';
import SpotifyAnalytics from './pages/Spotify';
import FlightDashboard from './pages/FlightDashboard';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="resume" element={<Resume />} />
          <Route path="analysis" element={<Analysis />} />
          <Route path="spotify" element={<SpotifyAnalytics />} />
          <Route path="flights" element={<FlightDashboard />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;