import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Resume from './pages/Resume';
import Analysis from './pages/Analysis';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Resume />} />
          <Route path="analysis" element={<Analysis />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
