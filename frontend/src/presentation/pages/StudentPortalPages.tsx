import { useEffect, useRef, useState } from 'react';
import { BrowserQRCodeReader } from '@zxing/browser';
import { Link } from 'react-router-dom';
import { apiClient } from '../../infrastructure/http/apiClient';
import { scanPresenceSessionUseCase } from '../di/containers';

type Item = Record<string, unknown>;

interface Student {
  id?: string;
  nom?: string;
  prenom?: string;
  matricule?: string;
  email?: string;
  programme?: { id?: string; nom?: string; code?: string; niveau?: string } | null;
}

function asItems(value: unknown): Item[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is Item => typeof item === 'object' && item !== null);
}

function text(value: unknown): string {
  if (value === null || value === undefined || value === '') return '—';
  if (typeof value === 'object') return '—';
  return String(value);
}

function dateText(value: unknown): string {
  if (typeof value !== 'string' || !value) return '';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString('fr-FR');
}

function PageTitle({ eyebrow, title, description }: {
  eyebrow: string; title: string; description: string;
}) {
  return (
    <div className="portal-heading">
      <p className="portal-eyebrow">{eyebrow}</p>
      <h1>{title}</h1>
      <p>{description}</p>
    </div>
  );
}

function Notice({ children, error = false }: { children: React.ReactNode; error?: boolean }) {
  return <div className={error ? 'portal-notice portal-error' : 'portal-notice'} role={error ? 'alert' : 'status'}>{children}</div>;
}

function useStudent() {
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    apiClient.get('/etudiants/me')
      .then((response) => {
        if (active) setStudent(response.data as Student);
      })
      .catch(() => {
        if (active) setError('Impossible de charger votre dossier étudiant. Vérifiez votre connexion.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, []);

  return { student, loading, error };
}

export function StudentAnnouncementsPage() {
  const [annonces, setAnnonces] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    apiClient.get('/annonces/publiees')
      .then((response) => {
        if (active) setAnnonces(asItems(response.data));
      })
      .catch(() => {
        if (active) setError('Les annonces ne peuvent pas être chargées. Vérifiez que le backend est à jour et redémarré.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, []);

  return (
    <section className="portal-page">
      <PageTitle eyebrow="PORTAIL ÉTUDIANT · COSTM" title="Annonces" description="Les actualités, informations et événements publiés par COSTM." />
      <div className="portal-hero">
        <div>
          <span className="portal-hero-label">VOTRE ESPACE ÉTUDIANT</span>
          <h2>Restez informé.</h2>
          <p>Consultez ici les communications officielles de l’établissement.</p>
        </div>
        <div className="portal-hero-mark" aria-hidden="true">C</div>
      </div>

      {error && <Notice error>{error}</Notice>}
      {loading && <p>Chargement des annonces…</p>}
      {!loading && !error && annonces.length === 0 && (
        <div className="portal-empty"><h2>Aucune annonce publiée</h2><p>Les nouvelles annonces apparaîtront ici dès leur publication par l’administration.</p></div>
      )}

      <div className="portal-announcements">
        {annonces.map((annonce, index) => (
          <article className="portal-card portal-announcement" key={String(annonce.id ?? index)}>
            <div className="portal-card-top">
              <span className="portal-tag">{text(annonce.type)}</span>
              <span className="portal-muted">{dateText(annonce.datePublication)}</span>
            </div>
            <h2>{text(annonce.titre)}</h2>
            <p className="portal-body">{text(annonce.contenu)}</p>
            {(Boolean(annonce.dateEvenement) || Boolean(annonce.lieu)) && (
              <div className="portal-meta">
                {Boolean(annonce.dateEvenement) && <span>◷ {dateText(annonce.dateEvenement)}</span>}
                {Boolean(annonce.lieu) && <span>⌖ {text(annonce.lieu)}</span>}
              </div>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}

export function StudentSpecificPage() {
  const [notes, setNotes] = useState<Item[]>([]);
  const [annonces, setAnnonces] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    Promise.allSettled([
      apiClient.get('/notes/me'),
      apiClient.get('/annonces/publiees'),
    ]).then(([notesResult, annoncesResult]) => {
      if (!active) return;
      if (notesResult.status === 'fulfilled') setNotes(asItems(notesResult.value.data));
      if (annoncesResult.status === 'fulfilled') {
        setAnnonces(asItems(annoncesResult.value.data).filter((a) => a.type === 'EXAMEN'));
      }
      if (notesResult.status === 'rejected' && annoncesResult.status === 'rejected') {
        setError('Impossible de charger les résultats. Réessayez lorsque le serveur est disponible.');
      }
    }).finally(() => {
      if (active) setLoading(false);
    });
    return () => { active = false; };
  }, []);

  return (
    <section className="portal-page">
      <PageTitle eyebrow="RÉSULTATS · INFORMATIONS CIBLÉES" title="Annonces spécifiques" description="Vos notes personnelles et les annonces publiées concernant les examens." />
      {error && <Notice error>{error}</Notice>}
      {loading ? <p>Chargement des résultats…</p> : (
        <>
          <section className="portal-section">
            <h2>Mes notes</h2>
            <p className="portal-section-intro">Ces données proviennent de votre dossier personnel.</p>
            {notes.length === 0 ? <div className="portal-empty">Aucune note disponible pour le moment.</div> : (
              <div className="portal-table-wrap">
                <table className="portal-table">
                  <thead><tr><th>Matière</th><th>Note</th><th>Semestre</th></tr></thead>
                  <tbody>{notes.map((note, index) => (
                    <tr key={String(note.id ?? index)}>
                      <td>{text(note.matiere ?? note.nom)}</td>
                      <td><strong>{text(note.valeur ?? note.note)}</strong></td>
                      <td>{text(note.semestre)}</td>
                    </tr>
                  ))}</tbody>
                </table>
              </div>
            )}
          </section>

          <section className="portal-section">
            <h2>Annonces d’examens</h2>
            {annonces.length === 0 ? <div className="portal-empty">Aucune annonce d’examen publiée pour le moment.</div> : (
              <div className="portal-announcements">
                {annonces.map((annonce, index) => (
                  <article className="portal-card" key={String(annonce.id ?? index)}>
                    <h3>{text(annonce.titre)}</h3>
                    <p className="portal-body">{text(annonce.contenu)}</p>
                    <span className="portal-muted">{dateText(annonce.dateEvenement ?? annonce.datePublication)}</span>
                  </article>
                ))}
              </div>
            )}
          </section>
          <p className="portal-muted">Le classement général n’est pas affiché tant qu’un classement officiel n’est pas fourni par le système. Aucune position n’est inventée.</p>
        </>
      )}
    </section>
  );
}

export function StudentCoursesPage() {
  const { student, loading: studentLoading, error: studentError } = useStudent();
  const [programmes, setProgrammes] = useState<Item[]>([]);
  const [loadingPrograms, setLoadingPrograms] = useState(true);
  const [programError, setProgramError] = useState('');

  useEffect(() => {
    let active = true;
    apiClient.get('/programmes')
      .then((response) => {
        if (active) setProgrammes(asItems(response.data));
      })
      .catch(() => {
        if (active) setProgramError('Impossible de charger le catalogue. Vérifiez que le backend autorise la consultation des programmes par les étudiants.');
      })
      .finally(() => {
        if (active) setLoadingPrograms(false);
      });
    return () => { active = false; };
  }, []);

  return (
    <section className="portal-page">
      <PageTitle eyebrow="FORMATION · COSTM" title="Cours et programmes" description="Découvrez les programmes proposés par COSTM et retrouvez votre formation actuelle." />
      <section className="portal-current-program">
        <span className="portal-tag">MA FORMATION</span>
        {studentLoading ? <p>Chargement du profil…</p> : studentError ? <Notice error>{studentError}</Notice> : (
          <>
            <h2>{student?.programme?.nom ?? 'Aucun programme associé'}</h2>
            <p>{student?.programme?.code ? `Code : ${student.programme.code}` : 'Le programme associé à votre dossier apparaîtra ici.'}</p>
            {student?.programme?.niveau && <span className="portal-muted">Niveau : {student.programme.niveau}</span>}
          </>
        )}
      </section>

      <section className="portal-section">
        <h2>Programmes disponibles chez COSTM</h2>
        {programError && <Notice error>{programError}</Notice>}
        {loadingPrograms ? <p>Chargement du catalogue…</p> : programmes.length === 0 ? (
          <div className="portal-empty">Aucun programme disponible à afficher.</div>
        ) : (
          <div className="portal-program-grid">
            {programmes.map((programme, index) => (
              <article className="portal-card portal-program-card" key={String(programme.id ?? index)}>
                <span className="portal-program-icon" aria-hidden="true">▣</span>
                <h3>{text(programme.nom)}</h3>
                {Boolean(programme.code) && <span className="portal-tag">{text(programme.code)}</span>}
                {Boolean(programme.niveau) && <p className="portal-muted">Niveau : {text(programme.niveau)}</p>}
                <p className="portal-body">{text(programme.description)}</p>
                {String(programme.id ?? '') === String(student?.programme?.id ?? '') && <span className="portal-current-badge">Votre programme</span>}
              </article>
            ))}
          </div>
        )}
      </section>
    </section>
  );
}

function extractToken(rawValue: string): string | null {
  const raw = rawValue.trim();
  try {
    const url = new URL(raw);
    const match = url.pathname.match(/\/pointage\/([^/]+)/);
    if (match?.[1]) return decodeURIComponent(match[1]);
  } catch {
    // Le QR peut aussi contenir directement le token.
  }
  if (/^[a-zA-Z0-9_-]{12,}$/.test(raw)) return raw;
  return null;
}

export function StudentPresencePage() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const frameRef = useRef<number | null>(null);
  const readerRef = useRef<BrowserQRCodeReader | null>(null);
  const controlsRef = useRef<{ stop: () => void } | null>(null);
  const runningRef = useRef(false);
  const [scanning, setScanning] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  function stopCamera() {
    runningRef.current = false;
    if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    frameRef.current = null;
    controlsRef.current?.stop();
    controlsRef.current = null;

    const video = videoRef.current;
    const stream = video?.srcObject as MediaStream | null;
    stream?.getTracks().forEach((track) => track.stop());
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    if (video) video.srcObject = null;
    setScanning(false);
  }

  async function submitScannedValue(rawValue: string) {
    if (busy) return;
    const token = extractToken(rawValue);
    if (!token) {
      setError('Ce QR code ne correspond pas à une session de pointage COSTM.');
      return;
    }

    setBusy(true);
    setError('');
    setMessage('');
    stopCamera();

    try {
      await scanPresenceSessionUseCase.execute(token);
      setMessage('Présence enregistrée avec succès. Votre pointage est transmis à COSTM.');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Pointage impossible. Le QR code a peut-être expiré ou a déjà été utilisé.');
    } finally {
      setBusy(false);
    }
  }

  async function handleImageFile(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = '';

    if (!file) return;

    setError('');
    setMessage('');

    if (!file.type.startsWith('image/')) {
      setError('Choisissez un fichier image contenant le QR code.');
      return;
    }

    setBusy(true);
    let imageUrl = '';

    try {
      const reader = new BrowserQRCodeReader();
      readerRef.current = reader;
      imageUrl = URL.createObjectURL(file);

      const result = await reader.decodeFromImageUrl(imageUrl);
      await submitScannedValue(result.getText());
    } catch {
      setError('Aucun QR code lisible trouvé sur cette image. Essayez une photo plus nette.');
    } finally {
      if (imageUrl) URL.revokeObjectURL(imageUrl);
      setBusy(false);
    }
  }

  async function startCamera() {
    setError('');
    setMessage('');

    if (!navigator.mediaDevices?.getUserMedia) {
      setError('La caméra nécessite HTTPS ou localhost et une autorisation du navigateur.');
      return;
    }

    if (!videoRef.current) {
      setError('La zone de caméra est introuvable. Rechargez la page et réessayez.');
      return;
    }

    try {
      stopCamera();

      const reader = new BrowserQRCodeReader();
      readerRef.current = reader;
      runningRef.current = true;
      setScanning(true);

      const controls = await reader.decodeFromVideoDevice(
        undefined,
        videoRef.current,
        (result, _scanError, scanControls) => {
          if (result && runningRef.current) {
            runningRef.current = false;
            scanControls.stop();
            void submitScannedValue(result.getText());
          }
        }
      );

      controlsRef.current = controls;

      if (!runningRef.current) {
        controls.stop();
      }
    } catch (e) {
      stopCamera();
      setError(
        e instanceof Error
          ? e.message
          : 'Impossible de démarrer la caméra. Vérifiez les autorisations du navigateur.'
      );
    }
  }

  useEffect(() => () => {
    runningRef.current = false;
    controlsRef.current?.stop();
    streamRef.current?.getTracks().forEach((track) => track.stop());
    if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
  }, []);

  return (
    <section className="portal-page">
      <PageTitle eyebrow="POINTAGE · COSTM" title="Présence" description="Scannez le QR code présenté par l’administration pour enregistrer votre présence au cours." />
      <section className="portal-scan-card">
        <div className="portal-scan-icon">▦</div>
        <h2>Scanner le QR code du cours</h2>
        <p>Le QR doit être actif. Les sessions de pointage expirent après cinq minutes.</p>
        <video ref={videoRef} className={scanning ? 'portal-camera portal-camera-active' : 'portal-camera'} playsInline muted />
        {!scanning && !busy && (
          <div className="portal-scan-actions">
            <button className="portal-primary-button" type="button" onClick={() => void startCamera()}>
              Ouvrir la caméra
            </button>
            <button
              className="portal-secondary-button"
              type="button"
              onClick={() => fileInputRef.current?.click()}
            >
              Importer une photo du QR code
            </button>
          </div>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={(event) => void handleImageFile(event)}
          style={{ display: 'none' }}
          aria-label="Choisir une photo contenant un QR code"
        />
        {scanning && <button className="portal-secondary-button" type="button" onClick={stopCamera}>Arrêter la caméra</button>}
        {busy && <p>Enregistrement de votre présence…</p>}
        {message && <Notice>{message}</Notice>}
        {error && <Notice error>{error}</Notice>}
        <p className="portal-muted">Autorisez l’accès à la caméra lorsque le navigateur le demande.</p>
      </section>
    </section>
  );
}

export function StudentProfilePage() {
  const { student, loading, error } = useStudent();

  return (
    <section className="portal-page">
      <PageTitle eyebrow="MON COMPTE · COSTM" title="Mon profil" description="Consultez les informations liées à votre dossier étudiant." />
      {loading && <p>Chargement du profil…</p>}
      {error && <Notice error>{error}</Notice>}
      {!loading && student && (
        <section className="portal-profile-card">
          <div className="portal-avatar">{(student.prenom?.[0] ?? 'E').toUpperCase()}</div>
          <h2>{[student.prenom, student.nom].filter(Boolean).join(' ') || 'Étudiant COSTM'}</h2>
          <span className="portal-tag">ÉTUDIANT</span>
          <div className="portal-profile-grid">
            <div><span>Matricule</span><strong>{text(student.matricule)}</strong></div>
            <div><span>Adresse e-mail</span><strong>{text(student.email)}</strong></div>
            <div><span>Programme</span><strong>{text(student.programme?.nom)}</strong></div>
          </div>
          <p className="portal-muted">Pour corriger vos informations personnelles, veuillez contacter l’administration.</p>
          <Link className="portal-secondary-link" to="/etudiant/annonces">Retour aux annonces</Link>
        </section>
      )}
    </section>
  );
}
