import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';

// Un composant de Layout pour l'espace étudiant (Sidebar + Zone de contenu)
const StudentLayout: React.FC = () => {
  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-8">
        <Outlet />
      </main>
    </div>
  );
};

// Pages temporaires pour chaque onglet (vous pourrez les personnaliser plus tard)
const PlaceholderPage: React.FC<{ title: string }> = ({ title }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
    <h2 className="text-2xl font-bold text-slate-800 mb-2">{title}</h2>
    <p className="text-slate-600">Cette page est en cours de développement...</p>
  </div>
);

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Redirection de la racine vers les annonces générales */}
        <Route path="/" element={<Navigate to="/student/annonces-generales" replace />} />

        {/* Routes de l'Espace Étudiant */}
        <Route path="/student" element={<StudentLayout />}>
          <Route path="annonces-generales" element={<PlaceholderPage title="📢 Annonces Générales" />} />
          <Route path="annonces-specifiques" element={<PlaceholderPage title="🎯 Annonces Spécifiques" />} />
          <Route path="programme" element={<PlaceholderPage title="📚 Programme & Cours" />} />
          <Route path="evaluations" element={<PlaceholderPage title="📝 Évaluations & Résultats" />} />
          <Route path="presence" element={<PlaceholderPage title="⏱️ Présence & Assiduité" />} />
          <Route path="scolarite" element={<PlaceholderPage title="💳 Scolarité & Droit de Formation" />} />
          <Route path="certificat" element={<PlaceholderPage title="🎓 Mon Certificat QR" />} />
          <Route path="profil" element={<PlaceholderPage title="👤 Profil & Notifications" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;