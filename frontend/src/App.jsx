
import { Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Sentiment from './pages/Sentiment';
import ImageClassifier from './pages/ImageClassifier';
import History from './pages/History';

export default function App() {
  return (
    <div className="app-layout">
      <Navbar />

      <main className="main-area">
        <header className="topbar">
          <div>
            <h1 className="page-title">AI Dashboard</h1>
            <p className="page-subtitle">
              Your intelligent sentiment analysis workspace
            </p>
          </div>

          <div className="profile-chip">
            ● System Online
          </div>
        </header>

        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/sentiment" element={<Sentiment />} />
          <Route path="/image" element={<ImageClassifier />} />
          <Route path="/history" element={<History />} />
        </Routes>
      </main>
    </div>
  );
}