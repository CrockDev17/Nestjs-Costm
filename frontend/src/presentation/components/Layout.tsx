import { Fragment, useEffect, useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { TokenStorage } from '../../infrastructure/auth/TokenStorage';

function getRole(): string {
  try {
    const token = TokenStorage.get();
    if (!token) return '';
    const payload = token.split('.')[1];
    const normalized = payload.replace(/-/g, '+').replace(/_/g, '/');
    const decoded = JSON.parse(atob(normalized));
    return decoded.role ?? decoded.roles?.[0] ?? '';
  } catch {
    return '';
  }
}

const adminNavigation = [
  { label: 'Tableau de bord', to: '/dashboard', icon: '⌂', section: 'PILOTAGE' },
  { label: 'Étudiants', to: '/admin/etudiants', icon: '♙', section: 'GESTION ACADEMIQUE' },
  { label: 'Programmes', to: '/admin/programmes', icon: '▤', section: 'GESTION ACADEMIQUE' },
  { label: 'Annonces', to: '/admin/annonces', icon: '◉', section: 'COMMUNICATION' },
  { label: 'Notes', to: '/admin/notes', icon: '✎', section: 'GESTION ACADEMIQUE' },
  { label: 'Présences', to: '/admin/presences', icon: '◷', section: 'GESTION ACADEMIQUE' },
  { label: 'Pointage QR', to: '/admin/pointage-qr', icon: '▦', section: 'GESTION ACADEMIQUE' },
  { label: 'Paiements', to: '/admin/paiements', icon: '¤', section: 'GESTION FINANCIERE' },
  { label: 'Diplômes', to: '/admin/diplomes', icon: '◇', section: 'CERTIFICATION' },
];

const studentNavigation = [
  { label: 'Profil', to: '/etudiant/profil', icon: '♙', section: 'ESPACE ETUDIANT' },
  { label: 'Cours', to: '/etudiant/cours', icon: '▣', section: 'ESPACE ETUDIANT' },
  { label: 'Présence', to: '/etudiant/presence', icon: '▦', section: 'ESPACE ETUDIANT' },
  { label: 'Annonces', to: '/etudiant/annonces', icon: '▤', section: 'ESPACE ETUDIANT' },
  { label: 'Annonces spécifiques', to: '/etudiant/annonces-specifiques', icon: '◉', section: 'ESPACE ETUDIANT' },
];

export default function Layout() {
  const navigate = useNavigate();
  const role = getRole();
  const isStudent = role === 'ETUDIANT';
  const navigation = isStudent ? studentNavigation : adminNavigation;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    try {
      return localStorage.getItem('costm_theme') === 'dark' ? 'dark' : 'light';
    } catch {
      return 'light';
    }
  });

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try {
      localStorage.setItem('costm_theme', theme);
    } catch {
      // Le thème reste fonctionnel même si le stockage local est indisponible.
    }
  }, [theme]);

  function logout() {
    TokenStorage.clear();
    navigate('/login', { replace: true });
  }

  return (
    <div className="app-layout">
      <aside className={`app-sidebar${mobileMenuOpen ? " mobile-open" : ""}`}>
        <div className="sidebar-brand">
          <div className="brand-monogram">C</div>
          <div>
            <strong>COSTM</strong>
            <span>Gestion scolaire</span>
          </div>
        </div>

        <div className="sidebar-section">
          {isStudent ? 'ESPACE ÉTUDIANT' : 'ESPACE ADMINISTRATION'}
        </div>

        <nav className="sidebar-nav">
          {navigation.map((item, index) => (
            <Fragment key={item.to}>
              {(!isStudent && (index === 0 || item.section !== navigation[index - 1]?.section)) && (
                <div className="sidebar-section">{item.section}</div>
              )}
              <NavLink
                to={item.to}
                end={item.to === '/dashboard' || item.to === '/etudiant/annonces'}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}
              >
                <span className="sidebar-icon" aria-hidden="true">{item.icon}</span>
                <span>{item.label}</span>
              </NavLink>
            </Fragment>
          ))}
        </nav>

        <div className="sidebar-footer">
          <span className="status-dot" />
          <span>Plateforme COSTM</span>
        </div>
      </aside>

      {mobileMenuOpen && (
        <button
          type="button"
          className="mobile-menu-overlay"
          aria-label="Fermer le menu"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
      <div className="app-main">
        <header className="app-header">
          <button
            type="button"
            className="mobile-menu-toggle"
            aria-label={mobileMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen((open) => !open)}
          >
            {mobileMenuOpen ? '✕' : '☰'}
          </button>
          <div className="header-context">
            <span className="header-eyebrow">
              {isStudent ? 'PORTAIL PERSONNEL' : 'ESPACE DE GESTION'}
            </span>
            <strong>{isStudent ? 'Mon espace étudiant' : 'Administration scolaire'}</strong>
          </div>

          <div className="header-actions">
            <button
              type="button"
              className="theme-toggle"
              onClick={() => setTheme((current) => current === 'light' ? 'dark' : 'light')}
              aria-label={theme === 'light' ? 'Activer le mode sombre' : 'Activer le mode clair'}
            >
              {theme === 'light' ? '☾ Mode sombre' : '☀ Mode clair'}
            </button>
            <button type="button" className="logout-button" onClick={logout}>
              Déconnexion <span aria-hidden="true">↗</span>
            </button>
          </div>
        </header>

        <main className="app-content">
          <Outlet />
        </main>

        <footer className="app-footer">COSTM · Gestion de la scolarité</footer>
      </div>
    </div>
  );
}