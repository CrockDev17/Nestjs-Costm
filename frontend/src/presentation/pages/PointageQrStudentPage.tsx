import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { scanPresenceSessionUseCase } from '../di/containers';

export default function PointageQrStudentPage() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [status, setStatus] = useState('Vérification de la session...');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function scan() {
      if (!token) {
        setStatus('Le lien du QR code est invalide.');
        return;
      }

      const accessToken = localStorage.getItem('costm_access_token');

      if (!accessToken) {
        navigate('/login', {
          replace: true,
          state: { from: `/pointage/${token}` },
        });
        return;
      }

      try {
        await scanPresenceSessionUseCase.execute(token);
        if (!cancelled) {
          setSuccess(true);
          setStatus('Présence enregistrée avec succès.');
        }
      } catch (e) {
        if (!cancelled) {
          setSuccess(false);
          setStatus(e instanceof Error ? e.message : 'Le pointage a échoué. Le QR code a peut-être expiré ou a déjà été utilisé.');
        }
      }
    }

    void scan();

    return () => {
      cancelled = true;
    };
  }, [token, navigate]);

  return (
    <main style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: 24, background: '#f1f5f9', color: '#172033' }}>
      <section style={{ width: '100%', maxWidth: 480, padding: 28, background: 'white', borderRadius: 16, boxShadow: '0 10px 30px rgba(15,23,42,0.08)', textAlign: 'center' }}>
        <h1 style={{ marginTop: 0 }}>Pointage COSTM</h1>
        <p style={{ fontSize: 17, lineHeight: 1.6 }}>{status}</p>
        {success && <p style={{ color: '#15803d', fontWeight: 700 }}>Tu peux maintenant retourner à tes activités.</p>}
        {!success && !status.includes('Vérification') && (
          <button type="button" onClick={() => navigate('/login')} style={{ padding: '10px 16px', border: 0, borderRadius: 8, background: '#1d4ed8', color: 'white', cursor: 'pointer' }}>
            Retour à la connexion
          </button>
        )}
      </section>
    </main>
  );
}
