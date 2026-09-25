import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { PresencesView } from './pages/PresenceView';

function App() {
  return (
    <Router>
      <div style={{ display: 'flex' }}>
        <Sidebar />
        <main style={{ flex: 1, backgroundColor: '#f8fafc', minHeight: '100vh' }}>
          <Routes>
            <Route path="/" element={<Navigate to="/presences" replace />} />
            <Route path="/presences" element={<PresencesView />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;