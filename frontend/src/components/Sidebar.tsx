import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

export const Sidebar: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const menuItems = [
    { path: '/annonces-generales', label: '📢 Annonces Générales' },
    { path: '/annonces-specifiques', label: '🎯 Annonces Spécifiques' },
    { path: '/programme', label: '📚 Programme & Cours' },
    { path: '/evaluations', label: '📝 Évaluations & Résultats' },
    { path: '/presences', label: '⏱️ Présence & Assiduité' },
    { path: '/scolarite', label: '💳 Scolarité & Droit' },
    { path: '/certificat', label: '🎓 Mon Certificat QR' },
    { path: '/profil', label: '👤 Profil & Notifications' },
  ];

  return (
    <aside style={{ width: '260px', backgroundColor: '#0f172a', color: '#fff', minHeight: '100vh', padding: '1rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <div>
        <h2 style={{ fontSize: '1.2rem', color: '#38bdf8', marginBottom: '1.5rem' }}>🎓 Espace Étudiant</h2>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              style={({ isActive }) => ({
                padding: '0.6rem 0.8rem',
                borderRadius: '6px',
                color: isActive ? '#38bdf8' : '#cbd5e1',
                backgroundColor: isActive ? '#1e293b' : 'transparent',
                textDecoration: 'none',
                fontWeight: isActive ? 'bold' : 'normal',
              })}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>
      <button
        onClick={handleLogout}
        style={{ backgroundColor: '#ef4444', color: '#fff', border: 'none', padding: '0.6rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
      >
        Déconnexion
      </button>
    </aside>
  );
};