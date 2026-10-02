import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { AnnoncesPage } from './pages/AnnoncesPage';
import { ProgrammeCoursView } from './pages/ProgrammeCoursView';
import { EvaluationsPage } from './pages/EvaluationsPage';
import { PresenceView } from './pages/PresenceView';
import { ScolaritePage } from './pages/ScolaritePage';
import { CertificatPage } from './pages/CertificatPage';
import { ProfilPage } from './pages/ProfilPage';

export function App() {
  return (
    <BrowserRouter>
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <main className="flex-1 p-8 overflow-y-auto">
          <Routes>
            <Route path="/" element={<Navigate to="/annonces" replace />} />
            <Route path="/annonces" element={<AnnoncesPage />} />
            <Route path="/programme" element={<ProgrammeCoursView />} />
            <Route path="/evaluations" element={<EvaluationsPage />} />
            <Route path="/presence" element={<PresenceView />} />
            <Route path="/scolarite" element={<ScolaritePage />} />
            <Route path="/certificat" element={<CertificatPage />} />
            <Route path="/profil" element={<ProfilPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;