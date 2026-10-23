import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiClient } from '../../infrastructure/http/apiClient';

interface Etudiant {
  id: string;
  matricule: string;
  nom: string;
  prenom: string;
  email: string;
  programme?: { nom?: string } | null;
}

type RecordItem = Record<string, unknown>;

interface PersonalData {
  etudiant: Etudiant | null;
  notes: RecordItem[];
  paiements: RecordItem[];
  presences: RecordItem[];
  diplomes: RecordItem[];
}

type ApiResult = PromiseSettledResult<{ data: unknown }>;

const emptyData: PersonalData = {
  etudiant: null,
  notes: [],
  paiements: [],
  presences: [],
  diplomes: [],
};

function displayValue(value: unknown): string {
  if (value === null || value === undefined || value === '') return '—';
  if (typeof value === 'object') return '—';
  return String(value);
}

function formatDate(value: unknown): string {
  if (typeof value !== 'string' || !value) return '—';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString('fr-FR');
}

function asArray(result: ApiResult): RecordItem[] {
  if (result.status !== 'fulfilled' || !Array.isArray(result.value.data)) {
    return [];
  }

  return result.value.data.filter(
    (item): item is RecordItem => typeof item === 'object' && item !== null,
  );
}

export default function StudentDashboardPage() {
  const [data, setData] = useState<PersonalData>(emptyData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    async function loadPersonalData() {
      setLoading(true);
      setError('');

      const requests = await Promise.allSettled([
        apiClient.get('/etudiants/me'),
        apiClient.get('/notes/me'),
        apiClient.get('/paiements/me'),
        apiClient.get('/presences/me'),
        apiClient.get('/diplomes/me'),
      ]);

      if (cancelled) return;

      const [studentResult, notesResult, paymentsResult, presencesResult, diplomasResult] =
        requests as ApiResult[];

      if (studentResult.status !== 'fulfilled' || !studentResult.value.data) {
        setError(
          "Impossible de charger votre dossier étudiant. Vérifiez que votre compte est associé à un dossier COSTM.",
        );
        setLoading(false);
        return;
      }

      setData({
        etudiant: studentResult.value.data as Etudiant,
        notes: asArray(notesResult),
        paiements: asArray(paymentsResult),
        presences: asArray(presencesResult),
        diplomes: asArray(diplomasResult),
      });

      setLoading(false);
    }

    void loadPersonalData();

    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <section className="page-container student-page">
        <p className="portal-eyebrow">PORTAIL ÉTUDIANT · COSTM</p>
        <h1>Mon espace étudiant</h1>
        <p>Chargement de votre dossier personnel…</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="page-container student-page">
        <p className="portal-eyebrow">PORTAIL ÉTUDIANT · COSTM</p>
        <h1>Mon espace étudiant</h1>
        <div className="error-message" role="alert">{error}</div>
        <button type="button" onClick={() => window.location.reload()}>
          Réessayer
        </button>
      </section>
    );
  }

  const student = data.etudiant;

  const sections = [
    { title: 'Mes notes', count: data.notes.length, icon: '✎' },
    { title: 'Mes paiements', count: data.paiements.length, icon: '¤' },
    { title: 'Mes présences', count: data.presences.length, icon: '◷' },
    { title: 'Mes diplômes', count: data.diplomes.length, icon: '◇' },
  ];

  return (
    <section className="page-container student-page">
      <div className="student-welcome">
        <p className="portal-eyebrow">PORTAIL ÉTUDIANT · COSTM</p>
        <h1>Bonjour{student?.prenom ? `, ${student.prenom}` : ''} !</h1>
        <p>Retrouvez ici les informations liées à votre dossier scolaire personnel.</p>
      </div>

      <section className="dashboard-card student-profile">
        <h2>Mon profil</h2>
        <div className="student-profile-grid">
          <div>
            <span>Nom complet</span>
            <strong>{[student?.prenom, student?.nom].filter(Boolean).join(' ') || '—'}</strong>
          </div>
          <div>
            <span>Matricule</span>
            <strong>{student?.matricule || '—'}</strong>
          </div>
          <div>
            <span>Adresse e-mail</span>
            <strong>{student?.email || '—'}</strong>
          </div>
          <div>
            <span>Programme</span>
            <strong>{student?.programme?.nom || 'Non renseigné'}</strong>
          </div>
        </div>
      </section>

      <div className="dashboard-grid student-summary-grid">
        {sections.map((section) => (
          <article className="dashboard-card student-stat-card" key={section.title}>
            <span className="student-stat-icon" aria-hidden="true">{section.icon}</span>
            <h2>{section.title}</h2>
            <p className="student-stat">{section.count}</p>
            <p>Enregistrement(s) dans votre dossier.</p>
          </article>
        ))}
      </div>

      <section className="dashboard-card student-records">
        <h2>Mes dernières notes</h2>
        {data.notes.length === 0 ? (
          <p>Aucune note disponible pour le moment.</p>
        ) : (
          <div className="student-record-list">
            {data.notes.slice(0, 5).map((note, index) => (
              <div className="student-record" key={String(note.id ?? index)}>
                <strong>{displayValue(note.matiere ?? note.nom)}</strong>
                <span>
                  Note : {displayValue(note.valeur ?? note.note)}
                  {note.semestre ? ` · ${displayValue(note.semestre)}` : ''}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="dashboard-card student-records">
        <h2>Mes paiements</h2>
        {data.paiements.length === 0 ? (
          <p>Aucun paiement enregistré dans votre dossier.</p>
        ) : (
          <div className="student-record-list">
            {data.paiements.slice(0, 5).map((payment, index) => (
              <div className="student-record" key={String(payment.id ?? index)}>
                <strong>{displayValue(payment.motif ?? payment.description ?? 'Paiement')}</strong>
                <span>
                  Montant : {displayValue(payment.montant)}
                  {' · '}Statut : {displayValue(payment.statut)}
                  {' · '}{formatDate(payment.date ?? payment.createdAt)}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="dashboard-card student-records">
        <h2>Mes présences récentes</h2>
        {data.presences.length === 0 ? (
          <p>Aucune présence enregistrée pour le moment.</p>
        ) : (
          <div className="student-record-list">
            {data.presences.slice(0, 5).map((presence, index) => (
              <div className="student-record" key={String(presence.id ?? index)}>
                <strong>{displayValue(presence.statut)}</strong>
                <span>
                  {formatDate(presence.date)}
                  {presence.justification ? ` · ${displayValue(presence.justification)}` : ''}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="dashboard-card student-records">
        <h2>Mes diplômes</h2>
        {data.diplomes.length === 0 ? (
          <p>Aucun diplôme enregistré dans votre dossier pour le moment.</p>
        ) : (
          <div className="student-record-list">
            {data.diplomes.map((diploma, index) => (
              <div className="student-record" key={String(diploma.id ?? index)}>
                <strong>{displayValue(diploma.intitule ?? diploma.nom ?? 'Diplôme')}</strong>
                <span>Référence : {displayValue(diploma.reference)}</span>
                {typeof diploma.reference === 'string' && diploma.reference && (
                  <Link to={`/verify/${encodeURIComponent(diploma.reference)}`}>
                    Vérifier ce diplôme
                  </Link>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </section>
  );
}
