import { useCallback, useEffect, useState } from 'react';
import type { FormEvent } from 'react';

import { diplomeRepository, etudiantRepository } from '../di/containers';
import { generateCertificatePdf } from '../../infrastructure/certificates/CertificatePdfService';

import type { Diplome, CreateDiplomeInput } from '../../domain/entities/Diplome';
import type { Etudiant } from '../../domain/entities/Etudiant';

const emptyForm = (): CreateDiplomeInput => ({
  numero: '',
  type: 'AUTRE',
  dateObtention: new Date().toISOString().slice(0, 10),
  reference: '',
  mention: '',
  etudiantId: '',
});

export default function DiplomesPage() {
  const [diplomes, setDiplomes] = useState<Diplome[]>([]);
  const [etudiants, setEtudiants] = useState<Etudiant[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [form, setForm] = useState<CreateDiplomeInput>(emptyForm);

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

  const loadEtudiants = useCallback(async () => {
    try {
      setEtudiants(await etudiantRepository.list());
    } catch {
      setError('Impossible de charger les étudiants.');
    }
  }, []);

  useEffect(() => {
    void loadDiplomes();
    void loadEtudiants();
  }, [loadDiplomes, loadEtudiants]);

  async function handleCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setSuccess('');

    const etudiant = etudiants.find((item) => item.id === form.etudiantId);

    if (!etudiant) {
      setError('Veuillez sélectionner un étudiant.');
      return;
    }

    setSaving(true);

    try {
      const created = await diplomeRepository.create({
        ...form,
        mention: form.mention?.trim() || undefined,
      });

      const diplomePdf: Diplome = {
        ...created,
        etudiant: {
          id: etudiant.id,
          nom: etudiant.nom,
          prenom: etudiant.prenom,
          matricule: etudiant.matricule,
          programme: etudiant.programme ?? null,
        },
        programme: etudiant.programme ?? null,
      };

      setDiplomes((current) => [diplomePdf, ...current]);
      setForm(emptyForm());
      setShowForm(false);
      setSuccess('Le diplôme a été enregistré.');

      try {
        await generateCertificatePdf(diplomePdf);
        setSuccess('Diplôme enregistré et PDF généré avec succès.');
      } catch {
        setError('Diplôme enregistré, mais le PDF n’a pas pu être généré.');
      }
    } catch {
      setError('Échec de l’enregistrement. Vérifiez le numéro et la référence.');
    } finally {
      setSaving(false);
    }
  }

  async function handleGenerate(diplome: Diplome) {
    setError('');

    try {
      await generateCertificatePdf(diplome);
    } catch {
      setError('La génération du PDF a échoué.');
    }
  }

  return (
    <section className="page-container">
      <h1>Gestion des diplômes</h1>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
        <button
          type="button"
          onClick={() => {
            setShowForm((current) => !current);
            setError('');
            setSuccess('');
          }}
        >
          {showForm ? 'Fermer' : '+ Attribuer un diplôme'}
        </button>

        <button type="button" onClick={() => void loadDiplomes()}>
          Actualiser
        </button>
      </div>

      {showForm && (
        <div
          style={{
            border: '1px solid var(--border-color, #334155)',
            borderRadius: '10px',
            padding: '20px',
            marginBottom: '20px',
          }}
        >
          <h2>Nouveau diplôme</h2>

          <form
            onSubmit={handleCreate}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '16px',
              alignItems: 'end',
            }}
          >
            <div>
              <label htmlFor="diplome-etudiant">Étudiant</label>
              <select
                id="diplome-etudiant"
                value={form.etudiantId}
                onChange={(e) =>
                  setForm({ ...form, etudiantId: e.target.value })
                }
                required
                style={{ width: '100%' }}
              >
                <option value="">Sélectionner un étudiant</option>
                {etudiants.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.prenom} {e.nom} — {e.matricule}
                  </option>
                ))}
              </select>
            </div>


            <div>
              <label htmlFor="diplome-numero">Numéro du diplôme</label>
              <input
                id="diplome-numero"
                value={form.numero}
                onChange={(e) => setForm({ ...form, numero: e.target.value })}
                placeholder="Ex. COSTM-2026-002"
                required
                style={{ width: '100%' }}
              />
            </div>

            <div>
              <label htmlFor="diplome-reference">Référence</label>
              <input
                id="diplome-reference"
                value={form.reference}
                onChange={(e) =>
                  setForm({ ...form, reference: e.target.value })
                }
                placeholder="Ex. CERT-2026-L2-002"
                required
                style={{ width: '100%' }}
              />
            </div>

            <div>
              <label htmlFor="diplome-date">Date d'obtention</label>
              <input
                id="diplome-date"
                type="date"
                value={form.dateObtention}
                onChange={(e) =>
                  setForm({ ...form, dateObtention: e.target.value })
                }
                required
                style={{ width: '100%' }}
              />
            </div>

            <div>
              <label htmlFor="diplome-mention">Mention (facultatif)</label>
              <input
                id="diplome-mention"
                value={form.mention ?? ''}
                onChange={(e) => setForm({ ...form, mention: e.target.value })}
                placeholder="Ex. Très bien"
                style={{ width: '100%' }}
              />
            </div>

            <div style={{ gridColumn: '1 / -1' }}>
              <button type="submit" disabled={saving || etudiants.length === 0}>
                {saving ? 'Enregistrement...' : 'Enregistrer et générer le diplôme'}
              </button>
              {etudiants.length === 0 && (
                <p>Aucun étudiant disponible.</p>
              )}
            </div>
          </form>
        </div>
      )}

      {error && <p className="error-message">{error}</p>}
      {success && <p>{success}</p>}
      {loading && <p>Chargement...</p>}

      {!loading && diplomes.length === 0 && (
        <p>Aucun diplôme trouvé.</p>
      )}

      {!loading && diplomes.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>Référence</th>
              <th>Étudiant</th>
              <th>Programme</th>
              <th>Date d'obtention</th>
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
                <td>
                  {diplome.programme?.nom ??
                    diplome.etudiant?.programme?.nom ??
                    '—'}
                </td>
                <td>{diplome.dateObtention ?? '—'}</td>
                <td>
                  <button
                    type="button"
                    onClick={() => void handleGenerate(diplome)}
                  >
                    Générer le diplôme
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
