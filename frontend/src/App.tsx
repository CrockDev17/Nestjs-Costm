import './presentation/student-portal-contrast-fix.css';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Layout from './presentation/components/Layout';
import ProtectedRoute from './presentation/components/ProtectedRoute';
import { TokenStorage } from './infrastructure/auth/TokenStorage';
import LoginPage from './presentation/pages/LoginPage';
import DashboardPage from './presentation/pages/DashboardPage';
import EtudiantsPage from './presentation/pages/EtudiantsPage';
import ProgrammesPage from './presentation/pages/ProgrammesPage';
import NotesPage from './presentation/pages/NotesPage';
import DiplomesPage from './presentation/pages/DiplomesPage';
import VerifyDiplomePage from './presentation/pages/VerifyDiplomePage';
import PresencesPage from './presentation/pages/PresencesPage';
import PaiementsPage from './presentation/pages/PaiementsPage';
import AnnoncesPage from './presentation/pages/AnnoncesPage';
import PointageQrAdminPage from './presentation/pages/PointageQrAdminPage';
import PointageQrStudentPage from './presentation/pages/PointageQrStudentPage';
import {
  StudentAnnouncementsPage,
  StudentSpecificPage,
  StudentCoursesPage,
  StudentPresencePage,
  StudentProfilePage,
} from './presentation/pages/StudentPortalPages';
import './presentation/styles/student-portal.css';

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

function DashboardForRole() {
  return getRole() === 'ETUDIANT'
    ? <Navigate to="/etudiant/annonces" replace />
    : <DashboardPage />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/pointage/:token" element={<PointageQrStudentPage />} />
        <Route path="/verify" element={<VerifyDiplomePage />} />
        <Route path="/verify/:reference" element={<VerifyDiplomePage />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route element={<ProtectedRoute roles={['ADMIN', 'ETUDIANT']} />}>
              <Route path="/dashboard" element={<DashboardForRole />} />
            </Route>

            <Route element={<ProtectedRoute roles={['ETUDIANT']} />}>
              <Route path="/etudiant/annonces" element={<StudentAnnouncementsPage />} />
              <Route path="/etudiant/annonces-specifiques" element={<StudentSpecificPage />} />
              <Route path="/etudiant/cours" element={<StudentCoursesPage />} />
              <Route path="/etudiant/presence" element={<StudentPresencePage />} />
              <Route path="/etudiant/profil" element={<StudentProfilePage />} />
            </Route>

            <Route element={<ProtectedRoute roles={['ADMIN']} />}>
              <Route path="/admin/etudiants" element={<EtudiantsPage />} />
              <Route path="/admin/programmes" element={<ProgrammesPage />} />
              <Route path="/admin/annonces" element={<AnnoncesPage />} />
              <Route path="/admin/notes" element={<NotesPage />} />
              <Route path="/admin/presences" element={<PresencesPage />} />
              <Route path="/admin/pointage-qr" element={<PointageQrAdminPage />} />
              <Route path="/admin/paiements" element={<PaiementsPage />} />
              <Route path="/admin/diplomes" element={<DiplomesPage />} />
            </Route>
          </Route>
        </Route>

        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}