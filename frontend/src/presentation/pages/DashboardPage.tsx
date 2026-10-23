import { useCallback, useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { TokenStorage } from '../../infrastructure/auth/TokenStorage';
import {
  listEtudiantsUseCase,
  listProgrammesUseCase,
  listPaiementsUseCase,
  listAnnoncesUseCase,
} from '../di/containers';
import StudentDashboardPage from './StudentDashboardPage';

type DashboardStats = {
  etudiants: number;
  programmes: number;
  paiements: number;
  paiementsPayes: number;
  annonces: number;
  annoncesPubliees: number;
  brouillons: number;
  archives: number;
};

const initialStats: DashboardStats = {
  etudiants: 0,
  programmes: 0,
  paiements: 0,
  paiementsPayes: 0,
  annonces: 0,
  annoncesPubliees: 0,
  brouillons: 0,
  archives: 0,
};

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

export default function DashboardPage() {
  const role = getRole();
  const [stats, setStats] = useState<DashboardStats>(initialStats);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState<string[]>([]);
  const [updatedAt, setUpdatedAt] = useState('');

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    setErrors([]);

    const results = await Promise.allSettled([
      listEtudiantsUseCase.execute(),
      listProgrammesUseCase.execute(),
      listPaiementsUseCase.execute(),
      listAnnoncesUseCase.execute(),
    ]);

    const nextStats: DashboardStats = { ...initialStats };
    const nextErrors: string[] = [];

    const [etudiantsResult, programmesResult, paiementsResult, annoncesResult] =
      results;

    if (etudiantsResult.status === 'fulfilled') {
      nextStats.etudiants = etudiantsResult.value.length;
    } else {
      nextErrors.push('Étudiants');
    }

    if (programmesResult.status === 'fulfilled') {
      nextStats.programmes = programmesResult.value.length;
    } else {
      nextErrors.push('Programmes');
    }

    if (paiementsResult.status === 'fulfilled') {
      const paiements = paiementsResult.value;
      nextStats.paiements = paiements.length;
      nextStats.paiementsPayes = paiements.filter(
        (item) => item.statut === 'PAYE',
      ).length;
    } else {
      nextErrors.push('Paiements');
    }

    if (annoncesResult.status === 'fulfilled') {
      const annonces = annoncesResult.value;
      nextStats.annonces = annonces.length;
      nextStats.annoncesPubliees = annonces.filter(
        (item) => item.statut === 'PUBLIEE',
      ).length;
      nextStats.brouillons = annonces.filter(
        (item) => item.statut === 'BROUILLON',
      ).length;
      nextStats.archives = annonces.filter(
        (item) => item.statut === 'ARCHIVEE',
      ).length;
    } else {
      nextErrors.push('Annonces');
    }

    setStats(nextStats);
    setErrors(nextErrors);
    setUpdatedAt(new Date().toLocaleTimeString('fr-FR'));
    setLoading(false);
  }, []);

  useEffect(() => {
    if (role === 'ADMIN') {
      void loadDashboard();
    }
  }, [role, loadDashboard]);

  if (role === 'ETUDIANT') {
    return <StudentDashboardPage />;
  }

  if (role !== 'ADMIN') {
    return <Navigate to="/login" replace />;
  }

  const statCards = [
    {
      label: 'Étudiants inscrits',
      value: stats.etudiants,
      icon: '👥',
      description: 'Dossiers étudiants',
      to: '/admin/etudiants',
      tone: 'blue',
    },
    {
      label: 'Programmes',
      value: stats.programmes,
      icon: '🎓',
      description: 'Formations disponibles',
      to: '/admin/programmes',
      tone: 'violet',
    },
    {
      label: 'Paiements enregistrés',
      value: stats.paiements,
      icon: '💳',
      description: `${stats.paiementsPayes} paiement(s) au statut PAYE`,
      to: '/admin/paiements',
      tone: 'green',
    },
    {
      label: 'Annonces publiées',
      value: stats.annoncesPubliees,
      icon: '📢',
      description: `${stats.brouillons} brouillon(s) · ${stats.archives} archivée(s)`,
      to: '/admin/annonces',
      tone: 'orange',
    },
  ];

  const shortcuts = [
    {
      title: 'Étudiants',
      description: 'Consulter et gérer les dossiers étudiants.',
      icon: '👥',
      to: '/admin/etudiants',
    },
    {
      title: 'Programmes',
      description: 'Gérer les formations et leurs informations.',
      icon: '🎓',
      to: '/admin/programmes',
    },
    {
      title: 'Notes',
      description: 'Consulter et gérer les résultats scolaires.',
      icon: '📊',
      to: '/admin/notes',
    },
    {
      title: 'Présences',
      description: 'Suivre les présences des étudiants.',
      icon: '📅',
      to: '/admin/presences',
    },
    {
      title: 'Paiements',
      description: 'Consulter l’historique des paiements.',
      icon: '💳',
      to: '/admin/paiements',
    },
    {
      title: 'Diplômes',
      description: 'Gérer les diplômes et certificats.',
      icon: '🏅',
      to: '/admin/diplomes',
    },
    {
      title: 'Annonces',
      description: 'Publier les informations du COSTM.',
      icon: '📢',
      to: '/admin/annonces',
    },
    {
      title: 'Vérification publique',
      description: 'Vérifier un diplôme par sa référence.',
      icon: '🔎',
      to: '/verify',
    },
  ];

  return (
    <section className="page-container costm-dashboard">
      <header className="admin-welcome costm-dashboard-hero">
        <div>
          <p className="portal-eyebrow">COSTM · GESTION SCOLAIRE</p>
          <h1>Tableau de bord</h1>
          <p>
            Vue d’ensemble de votre établissement et accès rapide aux outils
            de gestion.
          </p>
        </div>
        <button
          type="button"
          className="costm-dashboard-refresh"
          onClick={() => void loadDashboard()}
          disabled={loading}
        >
          <span aria-hidden="true">{loading ? '⏳' : '↻'}</span>
          {loading ? 'Actualisation…' : 'Actualiser'}
        </button>
      </header>

      {errors.length > 0 && (
        <div className="costm-dashboard-alert" role="status">
          Certaines statistiques n’ont pas pu être chargées :{' '}
          <strong>{errors.join(', ')}</strong>. Vérifie la connexion à l’API
          et tes autorisations, puis actualise.
        </div>
      )}

      <div className="costm-dashboard-section-heading">
        <div>
          <h2>Indicateurs clés</h2>
          <p>Statistiques calculées à partir des données de l’API.</p>
        </div>
        <span className="costm-dashboard-updated">
          {updatedAt ? `Mis à jour à ${updatedAt}` : 'Chargement des données'}
        </span>
      </div>

      <div className="costm-dashboard-stats">
        {statCards.map((card) => (
          <Link
            key={card.label}
            to={card.to}
            className={`costm-dashboard-stat costm-dashboard-stat-${card.tone}`}
          >
            <div className="costm-dashboard-stat-top">
              <span className="costm-dashboard-stat-icon" aria-hidden="true">
                {card.icon}
              </span>
              <span className="costm-dashboard-stat-arrow" aria-hidden="true">
                ↗
              </span>
            </div>
            <span className="costm-dashboard-stat-label">{card.label}</span>
            <strong className="costm-dashboard-stat-value">
              {loading ? '…' : card.value.toLocaleString('fr-FR')}
            </strong>
            <span className="costm-dashboard-stat-description">
              {card.description}
            </span>
          </Link>
        ))}
      </div>

      <div className="costm-dashboard-section-heading costm-dashboard-shortcuts-heading">
        <div>
          <h2>Accès rapide</h2>
          <p>Ouvre directement le module dont tu as besoin.</p>
        </div>
      </div>

      <div className="costm-dashboard-shortcuts">
        {shortcuts.map((item) => (
          <Link
            key={item.title}
            to={item.to}
            className="costm-dashboard-shortcut"
          >
            <span className="costm-dashboard-shortcut-icon" aria-hidden="true">
              {item.icon}
            </span>
            <span className="costm-dashboard-shortcut-content">
              <strong>{item.title}</strong>
              <span>{item.description}</span>
            </span>
            <span className="costm-dashboard-shortcut-arrow" aria-hidden="true">
              →
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
