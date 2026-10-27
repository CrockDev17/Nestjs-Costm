import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import QRCode from 'qrcode';
import type { PresenceSession } from '../../domain/entities/PresenceSession';
import {
  createPresenceSessionUseCase,
  listPresenceSessionsUseCase,
  closePresenceSessionUseCase,
} from '../di/containers';

export default function PointageQrAdminPage() {
  const [cours, setCours] = useState('');
  const [sessions, setSessions] = useState<PresenceSession[]>([]);
  const [active, setActive] = useState<PresenceSession | null>(null);
  const [qr, setQr] = useState('');
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [, setTick] = useState(0);

  async function loadSessions() {
    setRefreshing(true);
    try {
      const data = await listPresenceSessionsUseCase.execute();
      setSessions(data);
      setError('');
    } catch {
      setError('Impossible de charger les sessions. Vérifie que le backend fonctionne et que tu es connecté comme administrateur.');
    } finally {
      setRefreshing(false);
    }
  }

  useEffect(() => {
    void loadSessions();
  }, []);

  useEffect(() => {
    if (!active) {
      setQr('');
      return;
    }

    const url = `${window.location.origin}/pointage/${active.token}`;
    let cancelled = false;

    QRCode.toDataURL(url, { width: 280, margin: 2 })
      .then((data) => {
        if (!cancelled) setQr(data);
      })
      .catch(() => {
        if (!cancelled) setError('Impossible de générer le QR code.');
      });

    return () => {
      cancelled = true;
    };
  }, [active]);

  useEffect(() => {
    const timer = window.setInterval(() => setTick((n) => n + 1), 1000);
    return () => window.clearInterval(timer);
  }, []);

  function expired(session: PresenceSession) {
    return Boolean(session.closedAt) || Date.now() >= new Date(session.expiresAt).getTime();
  }

  function remaining(session: PresenceSession) {
    const seconds = Math.max(0, Math.floor((new Date(session.expiresAt).getTime() - Date.now()) / 1000));
    return `${Math.floor(seconds / 60)} min ${String(seconds % 60).padStart(2, '0')} s`;
  }

  async function createSession(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const session = await createPresenceSessionUseCase.execute(cours.trim());
      setActive(session);
      setCours('');
      setMessage('Session créée. Le QR code est valable 5 minutes.');
      await loadSessions();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Échec de création de la session.');
    } finally {
      setLoading(false);
    }
  }

  async function closeSession(session: PresenceSession) {
    setError('');
    setMessage('');

    try {
      await closePresenceSessionUseCase.execute(session.id);
      setMessage('Session clôturée.');
      if (active?.id === session.id) {
        setActive({ ...session, closedAt: new Date().toISOString() });
      }
      await loadSessions();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Impossible de clôturer la session.');
    }
  }

  async function showSession(session: PresenceSession) {
    setActive(session);
    setError('');
    setMessage('');
  }

  return (
    <main style={{ maxWidth: 1000, margin: '0 auto', padding: 24, color: '#172033' }}>
      <h1 style={{ fontSize: 28, marginBottom: 8 }}>Pointage par QR code</h1>
      <p style={{ color: '#64748b', marginTop: 0 }}>
        Crée une session pour un cours. Le QR code expire automatiquement après 5 minutes.
      </p>

      {error && <p role="alert" style={{ background: '#fee2e2', color: '#991b1b', padding: 12, borderRadius: 8 }}>{error}</p>}
      {message && <p role="status" style={{ background: '#dcfce7', color: '#166534', padding: 12, borderRadius: 8 }}>{message}</p>}

      <form onSubmit={createSession} style={{ display: 'flex', gap: 12, flexWrap: 'wrap', margin: '24px 0', padding: 18, border: '1px solid #e2e8f0', borderRadius: 12 }}>
        <input
          value={cours}
          onChange={(e) => setCours(e.target.value)}
          placeholder="Nom du cours (ex. Réseaux informatiques)"
          maxLength={120}
          required
          style={{ flex: '1 1 280px', padding: 12, border: '1px solid #cbd5e1', borderRadius: 8 }}
        />
        <button disabled={loading} type="submit" style={{ padding: '12px 18px', border: 0, borderRadius: 9, background: loading ? '#64748b' : '#172554', color: 'white', cursor: loading ? 'wait' : 'pointer', fontWeight: 700, boxShadow: '0 4px 10px rgba(29,78,216,.18)', transition: 'background .2s, transform .2s' }}>
          {loading ? 'Création...' : 'Créer le QR code (5 min)'}
        </button>
      </form>

      {active && (
        <section style={{ marginBottom: 28, padding: 20, border: '1px solid #bfdbfe', borderRadius: 12, background: '#eff6ff' }}>
          <h2 style={{ marginTop: 0 }}>{active.cours}</h2>
          <p>
            État : <strong>{expired(active) ? 'Expirée ou clôturée' : 'Active'}</strong>
            {!expired(active) && <> · Temps restant : <strong>{remaining(active)}</strong></>}
          </p>
          {qr && <img src={qr} alt={`QR code pour ${active.cours}`} width={280} height={280} style={{ display: 'block', background: 'white', padding: 8, borderRadius: 8 }} />}
          <p style={{ overflowWrap: 'anywhere', fontSize: 13 }}>Lien : {`${window.location.origin}/pointage/${active.token}`}</p>
          {!expired(active) && (
            <button type="button" onClick={() => void closeSession(active)} style={{ padding: '10px 16px', border: '1px solid #fecaca', borderRadius: 9, background: '#fff1f2', color: '#b91c1c', cursor: 'pointer', fontWeight: 700, boxShadow: '0 2px 5px rgba(185,28,28,.08)' }}>
              Clôturer la session
            </button>
          )}
          <h3>Étudiants pointés : {active.presences?.length ?? 0}</h3>
          {active.presences?.length ? (
            <ul>
              {active.presences.map((p) => (
                <li key={p.id}>{p.etudiant?.matricule ?? 'Matricule inconnu'} — {p.etudiant ? `${p.etudiant.nom} ${p.etudiant.prenom}` : 'Étudiant'} — {p.statut}</li>
              ))}
            </ul>
          ) : <p>La liste apparaîtra lorsque les présences de cette session seront chargées.</p>}
        </section>
      )}

      <h2>Sessions créées</h2>
      {sessions.length === 0 ? <p>Aucune session pour le moment.</p> : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', padding: 10, borderBottom: '1px solid #cbd5e1' }}>Cours</th>
                <th style={{ textAlign: 'left', padding: 10, borderBottom: '1px solid #cbd5e1' }}>Expiration</th>
                <th style={{ textAlign: 'left', padding: 10, borderBottom: '1px solid #cbd5e1' }}>État</th>
                <th style={{ textAlign: 'left', padding: 10, borderBottom: '1px solid #cbd5e1' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sessions.map((session) => (
                <tr key={session.id}>
                  <td style={{ padding: 10, borderBottom: '1px solid #e2e8f0' }}>{session.cours}</td>
                  <td style={{ padding: 10, borderBottom: '1px solid #e2e8f0' }}>{new Date(session.expiresAt).toLocaleString()}</td>
                  <td style={{ padding: 10, borderBottom: '1px solid #e2e8f0' }}>{expired(session) ? 'Expirée / clôturée' : 'Active'}</td>
                  <td style={{ padding: 10, borderBottom: '1px solid #e2e8f0', whiteSpace: 'nowrap' }}>
                    <button type="button" onClick={() => void showSession(session)} style={{ padding: '8px 13px', border: '1px solid #bfdbfe', borderRadius: 8, background: '#eff6ff', color: '#1d4ed8', fontWeight: 700, cursor: 'pointer', marginRight: 8 }}>▦ Voir le QR</button>{' '}
                    {!expired(session) && <button type="button" onClick={() => void closeSession(session)} style={{ padding: '8px 13px', border: '1px solid #fecaca', borderRadius: 8, background: '#fff1f2', color: '#b91c1c', fontWeight: 700, cursor: 'pointer' }}>✕ Clôturer</button>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <button type="button" disabled={refreshing} onClick={() => void loadSessions()} style={{ marginTop: 16, padding: '10px 16px', border: '1px solid #cbd5e1', borderRadius: 9, background: refreshing ? '#e2e8f0' : 'white', color: '#334155', fontWeight: 700, cursor: refreshing ? 'wait' : 'pointer', boxShadow: '0 2px 5px rgba(15,23,42,.05)' }}>{refreshing ? '↻ Actualisation...' : '↻ Actualiser les sessions'}</button>
    </main>
  );
}


