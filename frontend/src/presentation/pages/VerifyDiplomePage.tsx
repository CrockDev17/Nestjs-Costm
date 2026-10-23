import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { useParams } from 'react-router-dom';
import { diplomeRepository } from '../di/containers';
import type { DiplomaVerification } from '../../domain/entities/Diplome';

export default function VerifyDiplomaPage() {
  const { reference: routeReference } = useParams<{ reference: string }>();
  const [reference, setReference] = useState(routeReference ?? '');
  const [result, setResult] = useState<DiplomaVerification | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (routeReference) setReference(routeReference);
  }, [routeReference]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);

    try {
      setResult(await diplomeRepository.verify(reference.trim()));
    } catch {
      setError('Vérification impossible. Vérifiez la référence saisie.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="page-container">
      <h1>Vérifier un diplôme COSTM</h1>
      <p>Cette page permet de vérifier l’authenticité d’un diplôme.</p>

      <form onSubmit={handleSubmit}>
        <label htmlFor="reference">Référence du diplôme</label>
        <input
          id="reference"
          value={reference}
          onChange={(event) => setReference(event.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Vérification...' : 'Vérifier'}
        </button>
      </form>

      {error && <p className="error-message">{error}</p>}

      {result && (
        <section>
          <h2>{result.valid ? 'Diplôme valide' : 'Diplôme non validé'}</h2>
          <p>
            {result.message ??
              (result.valid
                ? 'La référence correspond à un diplôme valide.'
                : 'Aucun diplôme valide trouvé pour cette référence.')}
          </p>

          {result.valid && result.diplome && (
            <>
              <p>
                <strong>Référence :</strong> {result.diplome.reference}
              </p>
              <p>
                <strong>Étudiant :</strong>{' '}
                {result.diplome.etudiant
                  ? `${result.diplome.etudiant.prenom ?? ''} ${result.diplome.etudiant.nom ?? ''}`.trim()
                  : '—'}
              </p>
              <p>
                <strong>Programme :</strong>{' '}
                {result.diplome.programme?.nom ?? '—'}
              </p>
              <p>
                <strong>Date :</strong>{' '}
                {result.diplome.dateObtention ?? '—'}
              </p>
            </>
          )}
        </section>
      )}
    </main>
  );
}