import { useCallback, useEffect, useMemo, useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import {
  createPaiementUseCase,
  listPaiementsUseCase,
  etudiantRepository,
} from '../di/containers';
import type { Paiement, PaiementStatut } from '../../domain/entities/Paiement';
import type { Etudiant } from '../../domain/entities/Etudiant';

const statutLabels: Record<PaiementStatut, string> = {
  PAYE: 'Payé',
  PARTIEL: 'Partiel',
  IMPAYE: 'Impayé',
};

function getErrorMessage(error: unknown): string {
  const err = error as {
    response?: { data?: { message?: string | string[] } };
    message?: string;
  };

  const message = err.response?.data?.message ?? err.message;

  return Array.isArray(message)
    ? message.join(', ')
    : message || 'Une erreur est survenue.';
}

function today(): string {
  const date = new Date();
  const offset = date.getTimezoneOffset();
  return new Date(date.getTime() - offset * 60_000).toISOString().slice(0, 10);
}

export default function PaiementsPage() {
  const [paiements, setPaiements] = useState<Paiement[]>([]);
  const [etudiants, setEtudiants] = useState<Etudiant[]>([]);
  const [search, setSearch] = useState('');
  const [filtreStatut, setFiltreStatut] = useState('TOUS');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [form, setForm] = useState({
    montant: '',
    date: today(),
    motif: '',
    statut: 'IMPAYE' as PaiementStatut,
    reference: '',
    etudiantId: '',
  });

  const loadData = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const [paiementsData, etudiantsData] = await Promise.all([
        listPaiementsUseCase.execute(),
        etudiantRepository.list(),
      ]);

      setPaiements(paiementsData);
      setEtudiants(etudiantsData);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const filteredPaiements = useMemo(() => {
    const query = search.trim().toLowerCase();

    return paiements.filter((paiement) => {
      const student = paiement.etudiant;
      const studentName = `${student?.nom ?? ''} ${student?.prenom ?? ''}`.toLowerCase();

      const matchesSearch =
        !query ||
        paiement.reference.toLowerCase().includes(query) ||
        paiement.motif.toLowerCase().includes(query) ||
        studentName.includes(query) ||
        (student?.matricule ?? '').toLowerCase().includes(query);

      const matchesStatus =
        filtreStatut === 'TOUS' || paiement.statut === filtreStatut;

      return matchesSearch && matchesStatus;
    });
  }, [paiements, search, filtreStatut]);

  const totalPaye = useMemo(
    () =>
      paiements
        .filter((p) => p.statut === 'PAYE')
        .reduce((total, p) => total + Number(p.montant), 0),
    [paiements],
  );

  function handleChange(
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);

    try {
      await createPaiementUseCase.execute({
        montant: Number(form.montant),
        date: form.date,
        motif: form.motif,
        statut: form.statut,
        reference: form.reference,
        etudiantId: form.etudiantId,
      });

      setSuccess('Paiement enregistré.');
      setForm({
        montant: '',
        date: today(),
        motif: '',
        statut: 'IMPAYE',
        reference: '',
        etudiantId: '',
      });

      await loadData();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="page">
      <header className="page-header">
        <div>
          <h1>Gestion des paiements</h1>
          <p>Enregistrer et suivre les paiements des étudiants.</p>
        </div>
      </header>

      <div className="stats-grid">
        <article className="stat-card">
          <span>Total des paiements enregistrés</span>
          <strong>{paiements.length}</strong>
        </article>
        <article className="stat-card">
          <span>Montant des paiements marqués « Payé »</span>
          <strong>{totalPaye.toLocaleString('fr-FR')} Ar</strong>
        </article>
        <article className="stat-card">
          <span>Paiements impayés</span>
          <strong>{paiements.filter((p) => p.statut === 'IMPAYE').length}</strong>
        </article>
      </div>

      <div className="content-grid">
        <section className="panel">
          <h2>Enregistrer un paiement</h2>

          <form onSubmit={handleSubmit} className="form-grid">
            <label>
              Étudiant
              <select
                name="etudiantId"
                value={form.etudiantId}
                onChange={handleChange}
                required
              >
                <option value="">Sélectionner un étudiant</option>
                {etudiants.map((etudiant) => (
                  <option key={etudiant.id} value={etudiant.id}>
                    {etudiant.matricule} — {etudiant.nom} {etudiant.prenom}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Montant (Ar)
              <input
                name="montant"
                type="number"
                min="0"
                step="any"
                value={form.montant}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              Date
              <input
                name="date"
                type="date"
                value={form.date}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              Référence unique
              <input
                name="reference"
                value={form.reference}
                onChange={handleChange}
                placeholder="Ex. PAY-2026-001"
                required
              />
            </label>

            <label>
              Motif
              <input
                name="motif"
                value={form.motif}
                onChange={handleChange}
                placeholder="Frais de scolarité..."
                required
              />
            </label>

            <label>
              Statut
              <select
                name="statut"
                value={form.statut}
                onChange={handleChange}
                required
              >
                <option value="PAYE">Payé</option>
                <option value="PARTIEL">Partiel</option>
                <option value="IMPAYE">Impayé</option>
              </select>
            </label>

            <button type="submit" disabled={saving}>
              {saving ? 'Enregistrement...' : 'Enregistrer le paiement'}
            </button>
          </form>
        </section>

        <section className="panel">
          <h2>Historique des paiements</h2>

          <div className="filters">
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Rechercher référence, étudiant, motif..."
            />

            <select
              value={filtreStatut}
              onChange={(event) => setFiltreStatut(event.target.value)}
            >
              <option value="TOUS">Tous les statuts</option>
              <option value="PAYE">Payé</option>
              <option value="PARTIEL">Partiel</option>
              <option value="IMPAYE">Impayé</option>
            </select>
          </div>

          {error && <p role="alert" className="error-message">{error}</p>}
          {success && <p className="success-message">{success}</p>}
          {loading ? (
            <p>Chargement des paiements...</p>
          ) : (
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Référence</th>
                    <th>Étudiant</th>
                    <th>Motif</th>
                    <th>Montant</th>
                    <th>Date</th>
                    <th>Statut</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPaiements.map((paiement) => (
                    <tr key={paiement.id}>
                      <td>{paiement.reference}</td>
                      <td>
                        {paiement.etudiant
                          ? `${paiement.etudiant.nom ?? ''} ${paiement.etudiant.prenom ?? ''}`
                          : paiement.etudiantId ?? '—'}
                      </td>
                      <td>{paiement.motif}</td>
                      <td>{Number(paiement.montant).toLocaleString('fr-FR')} Ar</td>
                      <td>{paiement.date?.slice(0, 10)}</td>
                      <td>{statutLabels[paiement.statut]}</td>
                    </tr>
                  ))}
                  {filteredPaiements.length === 0 && (
                    <tr>
                      <td colSpan={6}>Aucun paiement trouvé.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </section>
  );
}