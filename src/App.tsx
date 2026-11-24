import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';

// Project pages load on demand so the home page stays light
const Resume = lazy(() => import('./pages/Resume'));
const SpotifyAnalytics = lazy(() => import('./pages/Spotify'));
const FlightDashboard = lazy(() => import('./pages/FlightDashboard'));
const Writings = lazy(() => import('./pages/Writings'));

function App() {
  return (
    <Router>
      <Suspense fallback={<div className="min-h-screen bg-[#000005]" />}>
        <Routes>
          <Route index element={<Home />} />
          <Route path="resume" element={<Resume />} />
          <Route path="spotify" element={<SpotifyAnalytics />} />
          <Route path="flights" element={<FlightDashboard />} />
          <Route path="writings" element={<Writings />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
