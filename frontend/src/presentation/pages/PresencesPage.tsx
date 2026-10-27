import { useCallback, useEffect, useMemo, useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import {
  createPresenceUseCase,
  listPresencesUseCase,
  updatePresenceUseCase,
  deletePresenceUseCase,
  etudiantRepository,
} from '../di/containers';
import type { Presence, PresenceStatut } from '../../domain/entities/Presence';
import type { Etudiant } from '../../domain/entities/Etudiant';

type PresenceForm = {
  etudiantId: string;
  date: string;
  statut: PresenceStatut;
  justification: string;
};

function today(): string {
  const date = new Date();
  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return localDate.toISOString().slice(0, 10);
}

function createInitialForm(): PresenceForm {
  return {
    etudiantId: '',
    date: today(),
    statut: 'PRESENT',
    justification: '',
  };
}

function getErrorMessage(error: unknown): string {
  if (typeof error === 'object' && error !== null && 'response' in error) {
    const response = error.response;
    if (typeof response === 'object' && response !== null && 'data' in response) {
      const data = response.data;
      if (typeof data === 'object' && data !== null && 'message' in data) {
        const message = data.message;
        if (Array.isArray(message)) return message.join(', ');
        if (typeof message === 'string') return message;
      }
    }
  }
  return error instanceof Error
    ? error.message
    : 'Une erreur est survenue lors de l’opération.';
}

const statusLabels: Record<PresenceStatut, string> = {
  PRESENT: 'Présent',
  ABSENT: 'Absent',
  RETARD: 'En retard',
  EXCUSE: 'Excusé',
};

export default function PresencesPage() {
  const [presences, setPresences] = useState<Presence[]>([]);
  const [etudiants, setEtudiants] = useState<Etudiant[]>([]);
  const [form, setForm] = useState<PresenceForm>(createInitialForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [statutFilter, setStatutFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showManualForm, setShowManualForm] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [presenceData, etudiantData] = await Promise.all([
        listPresencesUseCase.execute(),
        etudiantRepository.list(),
      ]);
      setPresences(presenceData);
      setEtudiants(etudiantData);
    } catch (err: unknown) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  function handleChange(
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  function cancelEdit() {
    setEditingId(null);
    setShowManualForm(false);
    setForm(createInitialForm());
    setError('');
    setSuccess('');
  }

  function startEdit(presence: Presence) {
    setShowManualForm(true);
    setEditingId(presence.id);
    setForm({
      etudiantId:
        presence.etudiantId ??
        presence.etudiant?.id ??
        '',
      date: String(presence.date).slice(0, 10),
      statut: presence.statut,
      justification: presence.justification ?? '',
    });
    setError('');
    setSuccess('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);

    try {
      const payload = {
        etudiantId: form.etudiantId,
        date: form.date,
        statut: form.statut,
        justification: form.justification.trim(),
      };

      if (editingId) {
        await updatePresenceUseCase.execute(editingId, payload);
        setSuccess('Présence modifiée avec succès.');
      } else {
        await createPresenceUseCase.execute(payload);
        setSuccess('Présence enregistrée avec succès.');
      }

      setEditingId(null);
      setShowManualForm(false);
      setForm(createInitialForm());
      await loadData();
    } catch (err: unknown) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(presence: Presence) {
    const label = presenceStudentLabel(presence);
    const confirmed = window.confirm(
      `Voulez-vous vraiment supprimer la présence de ${label} du ${String(presence.date).slice(0, 10)} ? Cette action est définitive.`,
    );

    if (!confirmed) return;

    setError('');
    setSuccess('');
    setDeletingId(presence.id);

    try {
      await deletePresenceUseCase.execute(presence.id);
      if (editingId === presence.id) {
        setEditingId(null);
        setForm(createInitialForm());
      }
      setSuccess('Présence supprimée avec succès.');
      await loadData();
    } catch (err: unknown) {
      setError(getErrorMessage(err));
    } finally {
      setDeletingId(null);
    }
  }

  const filteredPresences = useMemo(() => {
    const query = search.trim().toLowerCase();

    return presences.filter((presence) => {
      const etudiant = presence.etudiant
        ? `${presence.etudiant.matricule ?? ''} ${presence.etudiant.nom ?? ''} ${presence.etudiant.prenom ?? ''}`
        : (() => {
            const student = etudiants.find((item) => item.id === presence.etudiantId);
            return student
              ? `${student.matricule} ${student.nom} ${student.prenom}`
              : presence.etudiantId ?? '';
          })();

      const date = String(presence.date).slice(0, 10);

      return (
        (!query ||
          etudiant.toLowerCase().includes(query) ||
          (presence.justification ?? '').toLowerCase().includes(query)) &&
        (!statutFilter || presence.statut === statutFilter) &&
        (!dateFilter || date === dateFilter)
      );
    });
  }, [presences, etudiants, search, statutFilter, dateFilter]);

  const todayPresences = useMemo(
    () => presences.filter((presence) => String(presence.date).slice(0, 10) === today()),
    [presences],
  );

  const todayPresent = todayPresences.filter((p) => p.statut === 'PRESENT').length;
  const todayAbsent = todayPresences.filter((p) => p.statut === 'ABSENT').length;
  const todayLate = todayPresences.filter((p) => p.statut === 'RETARD').length;
  const todayExcused = todayPresences.filter((p) => p.statut === 'EXCUSE').length;

  function studentLabel(student: Etudiant): string {
    return `${student.matricule} — ${student.nom} ${student.prenom}`;
  }

  function presenceStudentLabel(presence: Presence): string {
    if (presence.etudiant) {
      return `${presence.etudiant.matricule ?? ''} — ${presence.etudiant.nom ?? ''} ${presence.etudiant.prenom ?? ''}`;
    }
    const student = etudiants.find((item) => item.id === presence.etudiantId);
    return student ? studentLabel(student) : presence.etudiantId ?? '—';
  }

  return (
    <section className="page-container">
      <h1>Gestion des présences</h1>
      <p>Enregistrez, modifiez et consultez les présences des étudiants.</p>

      {error && <p className="error-message" role="alert">{error}</p>}
      {success && <p role="status">{success}</p>}

      <section className="dashboard-grid" aria-label="Bilan des présences du jour">
        <article className="dashboard-card">
          <h2>Présences aujourd'hui</h2>
          <p className="student-stat">{todayPresences.length}</p>
          <p>Enregistrements du jour</p>
        </article>
        <article className="dashboard-card">
          <h2>Présents</h2>
          <p className="student-stat">{todayPresent}</p>
        </article>
        <article className="dashboard-card">
          <h2>Absents enregistrés</h2>
          <p className="student-stat">{todayAbsent}</p>
        </article>
        <article className="dashboard-card">
          <h2>En retard</h2>
          <p className="student-stat">{todayLate}</p>
        </article>
        <article className="dashboard-card">
          <h2>Excusés</h2>
          <p className="student-stat">{todayExcused}</p>
        </article>
      </section>

      <div className="presence-admin-actions" style={{ display: "flex", flexWrap: "wrap", gap: "14px", alignItems: "center" }}>
        <button
          type="button"
          onClick={() => {
            setDateFilter(today());
            setSearch('');
            setStatutFilter('');
          }}
        >
          Voir les présences du jour
        </button>
        <button
          type="button"
          onClick={() => {
            setDateFilter('');
            setSearch('');
            setStatutFilter('');
          }}
        >
          Tout l'historique
        </button>
        <button
          type="button"
          onClick={() => {
            setEditingId(null);
            setForm(createInitialForm());
            setError('');
            setSuccess('');
            setShowManualForm((current) => !current);
          }}
        >
          {showManualForm ? 'Fermer le formulaire' : 'Ajouter une présence manuellement'}
        </button>
      </div>

      {showManualForm && (
      <form onSubmit={handleSubmit}>
        <h2>{editingId ? 'Modifier une présence' : 'Enregistrer une présence'}</h2>

        <div>
          <label htmlFor="etudiantId">Étudiant *</label>
          <select
            id="etudiantId"
            name="etudiantId"
            value={form.etudiantId}
            onChange={handleChange}
            required
          >
            <option value="">Sélectionner un étudiant</option>
            {etudiants.map((student) => (
              <option key={student.id} value={student.id}>
                {studentLabel(student)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="date">Date *</label>
          <input
            id="date"
            name="date"
            type="date"
            value={form.date}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="statut">Statut *</label>
          <select
            id="statut"
            name="statut"
            value={form.statut}
            onChange={handleChange}
            required
          >
            {Object.entries(statusLabels).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="justification">Justification (facultatif)</label>
          <textarea
            id="justification"
            name="justification"
            value={form.justification}
            onChange={handleChange}
            rows={3}
            placeholder="Motif d’absence ou de retard..."
          />
        </div>

        <button type="submit" disabled={saving || etudiants.length === 0}>
          {saving
            ? 'Enregistrement...'
            : editingId
              ? 'Enregistrer les modifications'
              : 'Enregistrer la présence'}
        </button>

        {editingId && (
          <button type="button" onClick={cancelEdit} disabled={saving}>
            Annuler la modification
          </button>
        )}

        {!loading && etudiants.length === 0 && (
          <p>Ajoutez d’abord un étudiant avant d’enregistrer une présence.</p>
        )}
      </form>
      )}

      <hr />

      <h2>Historique ({filteredPresences.length})</h2>

      <div>
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Rechercher un étudiant ou une justification..."
          aria-label="Rechercher une présence"
        />

        <input
          type="date"
          value={dateFilter}
          onChange={(event) => setDateFilter(event.target.value)}
          aria-label="Filtrer par date"
        />

        <select
          value={statutFilter}
          onChange={(event) => setStatutFilter(event.target.value)}
          aria-label="Filtrer par statut"
        >
          <option value="">Tous les statuts</option>
          {Object.entries(statusLabels).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>

        <button type="button" onClick={() => void loadData()} disabled={loading}>
          {loading ? 'Chargement...' : 'Actualiser'}
        </button>
      </div>

      {loading && <p>Chargement des présences...</p>}
      {!loading && filteredPresences.length === 0 && (
        <p>Aucune présence ne correspond aux filtres.</p>
      )}

      {!loading && filteredPresences.length > 0 && (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Étudiant</th>
                <th>Date</th>
                <th>Statut</th>
                <th>Justification</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPresences.map((presence) => (
                <tr key={presence.id}>
                  <td>{presenceStudentLabel(presence)}</td>
                  <td>{String(presence.date).slice(0, 10)}</td>
                  <td>{statusLabels[presence.statut] ?? presence.statut}</td>
                  <td>{presence.justification || '—'}</td>
                  <td>
                    <button
                      type="button"
                      onClick={() => startEdit(presence)}
                      disabled={saving || deletingId !== null}
                    >
                      Modifier
                    </button>
                    {' '}
                    <button
                      type="button"
                      onClick={() => void handleDelete(presence)}
                      disabled={saving || deletingId !== null}
                    >
                      {deletingId === presence.id ? 'Suppression...' : 'Supprimer'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
