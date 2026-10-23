
import { useCallback, useEffect, useMemo, useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';

import {
  createNoteUseCase,
  listNotesUseCase,
  etudiantRepository,
  updateNoteUseCase,
  deleteNoteUseCase,
} from '../di/containers';

import type { Note } from '../../domain/entities/Note';
import type { Etudiant } from '../../domain/entities/Etudiant';

type NoteForm = {
  valeur: string;
  matiere: string;
  semestre: string;
  etudiantId: string;
};

const initialForm: NoteForm = {
  valeur: '',
  matiere: '',
  semestre: '',
  etudiantId: '',
};

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

  if (error instanceof Error) return error.message;

  return 'Une erreur est survenue. Vérifiez le serveur et vos droits.';
}

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [etudiants, setEtudiants] = useState<Etudiant[]>([]);
  const [form, setForm] = useState<NoteForm>(initialForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [matiereFilter, setMatiereFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const loadData = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const [notesData, etudiantsData] = await Promise.all([
        listNotesUseCase.execute(),
        etudiantRepository.list(),
      ]);

      setNotes(notesData);
      setEtudiants(etudiantsData);
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
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(initialForm);
    setError('');
    setSuccess('');
  }

  function handleEdit(note: Note) {
    setEditingId(note.id);

    setForm({
      valeur: String(note.valeur ?? ''),
      matiere: note.matiere ?? '',
      semestre: note.semestre ?? '',
      etudiantId: note.etudiantId ?? note.etudiant?.id ?? '',
    });

    setError('');
    setSuccess('');

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setSuccess('');

    const valeur = Number(form.valeur);

    if (
      form.valeur.trim() === '' ||
      !Number.isFinite(valeur) ||
      valeur < 0 ||
      valeur > 20
    ) {
      setError('La note doit être comprise entre 0 et 20.');
      return;
    }

    if (!form.matiere.trim()) {
      setError('La matière est obligatoire.');
      return;
    }

    if (!form.etudiantId) {
      setError('Veuillez sélectionner un étudiant.');
      return;
    }

    setSaving(true);

    try {
      const data = {
        valeur,
        matiere: form.matiere.trim(),
        semestre: form.semestre.trim(),
        etudiantId: form.etudiantId,
      };

      if (editingId) {
        await updateNoteUseCase.execute(editingId, data);
        setSuccess('Note modifiée avec succès.');
      } else {
        await createNoteUseCase.execute(data);
        setSuccess('Note enregistrée avec succès.');
      }

      setEditingId(null);
      setForm(initialForm);

      await loadData();
    } catch (err: unknown) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(note: Note) {
    const studentName = noteStudentLabel(note);

    const confirmed = window.confirm(
      `Supprimer la note de ${note.matiere} (${note.valeur}/20) pour ${studentName} ? Cette action est irréversible.`,
    );

    if (!confirmed) return;

    setError('');
    setSuccess('');
    setDeletingId(note.id);

    try {
      await deleteNoteUseCase.execute(note.id);

      if (editingId === note.id) {
        setEditingId(null);
        setForm(initialForm);
      }

      setSuccess('Note supprimée avec succès.');

      await loadData();
    } catch (err: unknown) {
      setError(getErrorMessage(err));
    } finally {
      setDeletingId(null);
    }
  }

  const matieres = useMemo(
    () =>
      [...new Set(notes.map((note) => note.matiere).filter(Boolean))].sort(),
    [notes],
  );

  function studentLabel(student: Etudiant) {
    return `${student.matricule} — ${student.nom} ${student.prenom}`;
  }

  function noteStudentLabel(note: Note) {
    if (note.etudiant) {
      return `${note.etudiant.matricule ?? ''} ${note.etudiant.nom ?? ''} ${note.etudiant.prenom ?? ''}`.trim();
    }

    const student = etudiants.find(
      (item) => item.id === note.etudiantId,
    );

    return student ? studentLabel(student) : note.etudiantId ?? '—';
  }

  const filteredNotes = useMemo(() => {
    const query = search.trim().toLowerCase();

    return notes.filter((note) => {
      const student = noteStudentLabel(note).toLowerCase();

      const matchesSearch =
        !query ||
        note.matiere.toLowerCase().includes(query) ||
        student.includes(query) ||
        (note.semestre ?? '').toLowerCase().includes(query);

      const matchesMatiere =
        !matiereFilter || note.matiere === matiereFilter;

      return matchesSearch && matchesMatiere;
    });
  }, [notes, etudiants, search, matiereFilter]);

  return (
    <section className="page-container">
      <h1>Gestion des notes</h1>
      <p>Enregistrez, consultez et gérez les notes des étudiants.</p>

      {error && (
        <p className="error-message" role="alert">
          {error}
        </p>
      )}

      {success && <p role="status">{success}</p>}

      <form onSubmit={handleSubmit}>
        <h2>{editingId ? 'Modifier la note' : 'Ajouter une note'}</h2>

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
          <label htmlFor="matiere">Matière *</label>
          <input
            id="matiere"
            name="matiere"
            value={form.matiere}
            onChange={handleChange}
            maxLength={150}
            required
            placeholder="Ex. Réseaux informatiques"
          />
        </div>

        <div>
          <label htmlFor="valeur">Note sur 20 *</label>
          <input
            id="valeur"
            name="valeur"
            type="number"
            min="0"
            max="20"
            step="0.01"
            value={form.valeur}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="semestre">Semestre</label>
          <input
            id="semestre"
            name="semestre"
            value={form.semestre}
            onChange={handleChange}
            placeholder="Ex. S1"
          />
        </div>

        {/* Boutons avec un espacement contrôlé */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: '12px',
            marginTop: '12px',
          }}
        >
          <button
            type="submit"
            disabled={saving || etudiants.length === 0}
          >
            {saving
              ? 'Enregistrement...'
              : editingId
                ? 'Enregistrer les modifications'
                : 'Enregistrer la note'}
          </button>

          {editingId && (
            <button
              type="button"
              onClick={cancelEdit}
              disabled={saving}
            >
              Annuler la modification
            </button>
          )}
        </div>

        {etudiants.length === 0 && !loading && (
          <p>
            Ajoutez d’abord un étudiant pour pouvoir lui attribuer une note.
          </p>
        )}
      </form>

      <hr />

      <div>
        <h2>Notes enregistrées ({filteredNotes.length})</h2>

        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Rechercher une matière ou un étudiant..."
          aria-label="Rechercher une note"
        />

        <select
          value={matiereFilter}
          onChange={(event) => setMatiereFilter(event.target.value)}
          aria-label="Filtrer par matière"
        >
          <option value="">Toutes les matières</option>

          {matieres.map((matiere) => (
            <option key={matiere} value={matiere}>
              {matiere}
            </option>
          ))}
        </select>

        <button
          type="button"
          onClick={() => void loadData()}
          disabled={loading}
        >
          {loading ? 'Chargement...' : 'Actualiser'}
        </button>
      </div>

      {loading && <p>Chargement des notes...</p>}

      {!loading && filteredNotes.length === 0 && (
        <p>Aucune note ne correspond à la recherche.</p>
      )}

      {!loading && filteredNotes.length > 0 && (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Étudiant</th>
                <th>Matière</th>
                <th>Semestre</th>
                <th>Note / 20</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredNotes.map((note) => (
                <tr key={note.id}>
                  <td>{noteStudentLabel(note)}</td>
                  <td>{note.matiere}</td>
                  <td>{note.semestre || '—'}</td>
                  <td>
                    {Number(note.valeur).toLocaleString('fr-FR', {
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 2,
                    })}
                  </td>
                  <td>
                    <button
                      type="button"
                      onClick={() => handleEdit(note)}
                      disabled={saving || deletingId !== null}
                    >
                      Modifier
                    </button>

                    <button
                      type="button"
                      onClick={() => void handleDelete(note)}
                      disabled={saving || deletingId !== null}
                      style={{ marginLeft: '8px' }}
                    >
                      {deletingId === note.id
                        ? 'Suppression...'
                        : 'Supprimer'}
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
