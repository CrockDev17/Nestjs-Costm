import { useCallback, useEffect, useState } from 'react';
import { diplomeRepository } from '../di/containers';
import { generateCertificatePdf } from '../../infrastructure/certificates/CertificatePdfService';
import type { Diplome } from '../../domain/entities/Diplome';

export default function DiplomesPage() {
  const [diplomes, setDiplomes] = useState<Diplome[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadDiplomes = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      setDiplomes(await diplomeRepository.list());
    } catch {
      setError('Impossible de charger les diplômes.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadDiplomes();
  }, [loadDiplomes]);

  async function handlePdf(diplome: Diplome) {
    try {
      await generateCertificatePdf(diplome);
    } catch {
      setError('La génération du certificat PDF a échoué.');
    }
  }

  return (
    <section className="page-container">
      <h1>Gestion des diplômes</h1>

      <button type="button" onClick={() => void loadDiplomes()}>
        Actualiser
      </button>

      {loading && <p>Chargement...</p>}
      {error && <p className="error-message">{error}</p>}

      {!loading && !error && diplomes.length === 0 && (
        <p>Aucun diplôme trouvé.</p>
      )}

      {!loading && diplomes.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>Référence</th>
              <th>Étudiant</th>
              <th>Programme</th>
              <th>Date d’obtention</th>
              <th>Certificat</th>
            </tr>
          </thead>
          <tbody>
            {diplomes.map((diplome) => (
              <tr key={diplome.id}>
                <td>{diplome.reference}</td>
                <td>
                  {diplome.etudiant
                    ? `${diplome.etudiant.prenom ?? ''} ${diplome.etudiant.nom ?? ''}`.trim()
                    : '—'}
                </td>
                <td>{diplome.programme?.nom ?? '—'}</td>
                <td>{diplome.dateObtention ?? '—'}</td>
                <td>
                  <button
                    type="button"
                    onClick={() => void handlePdf(diplome)}
                  >
                    Télécharger PDF
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}