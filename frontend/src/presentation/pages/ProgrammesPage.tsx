import { useCallback, useEffect, useState } from 'react';
import { programmeRepository } from '../di/containers';
import type { Programme } from '../../domain/entities/Programme';

type ProgrammeForm = {
  code: string;
  nom: string;
  niveau: string;
  description: string;
};

const emptyForm: ProgrammeForm = {
  code: '',
  nom: '',
  niveau: '',
  description: '',
};

export default function ProgrammesPage() {
  const [programmes, setProgrammes] = useState<Programme[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [search, setSearch] = useState('');
  const [form, setForm] = useState<ProgrammeForm>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);

  const loadProgrammes = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const data = await programmeRepository.list();
      setProgrammes(data);
    } catch {
      setError('Impossible de charger les programmes. Vérifiez votre connexion.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadProgrammes();
  }, [loadProgrammes]);

  function handleChange(
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
  }

  function resetForm() {
    setForm(emptyForm);
    setEditingId(null);
  }

  function handleEdit(programme: Programme) {
    setEditingId(programme.id);
    setForm({
      code: programme.code,
      nom: programme.nom,
      niveau: programme.niveau,
      description: programme.description ?? '',
    });
    setError('');
    setSuccess('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);

    try {
      const payload = {
        code: form.code.trim(),
        nom: form.nom.trim(),
        niveau: form.niveau.trim(),
        description: form.description.trim() || undefined,
      };

      if (editingId) {
        await programmeRepository.update(editingId, payload);
        setSuccess('Programme modifié avec succès.');
      } else {
        await programmeRepository.create(payload);
        setSuccess('Programme créé avec succès.');
      }

      resetForm();
      await loadProgrammes();
    } catch (err: unknown) {
      const message =
        typeof err === 'object' &&
          err !== null &&
          'response' in err &&
          typeof err.response === 'object' &&
          err.response !== null &&
          'data' in err.response &&
          typeof err.response.data === 'object' &&
          err.response.data !== null &&
          'message' in err.response.data
          ? err.response.data.message
          : null;

      setError(
        Array.isArray(message)
          ? message.join(', ')
          : typeof message === 'string'
            ? message
            : 'Opération impossible. Vérifiez les données et vos droits administrateur.',
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm('Voulez-vous vraiment supprimer ce programme ?')) {
      return;
    }

    setError('');
    setSuccess('');

    try {
      await programmeRepository.delete(id);
      if (editingId === id) resetForm();
      setSuccess('Programme supprimé avec succès.');
      await loadProgrammes();
    } catch {
      setError(
        'La suppression a échoué. Vérifiez si des étudiants sont liés à ce programme.',
      );
    }
  }

  const filteredProgrammes = programmes.filter((programme) => {
    const query = search.toLowerCase();

    return (
      programme.code.toLowerCase().includes(query) ||
      programme.nom.toLowerCase().includes(query) ||
      programme.niveau.toLowerCase().includes(query) ||
      (programme.description ?? '').toLowerCase().includes(query)
    );
  });

  return (
    <section className="page-container">
      <h1>Gestion des programmes</h1>
      <p>Créez, consultez et gérez les programmes de formation du COSTM.</p>

      {error && <p className="error-message">{error}</p>}
      {success && <p role="status">{success}</p>}

      <form onSubmit={handleSubmit}>
        <h2>{editingId ? 'Modifier le programme' : 'Ajouter un programme'}</h2>

        <div>
          <label htmlFor="code">Code du programme *</label>
          <input
            id="code"
            name="code"
            value={form.code}
            onChange={handleChange}
            maxLength={20}
            required
            placeholder="Ex. INFO-L2"
          />
        </div>

        <div>
          <label htmlFor="nom">Nom du programme *</label>
          <input
            id="nom"
            name="nom"
            value={form.nom}
            onChange={handleChange}
            maxLength={150}
            required
            placeholder="Ex. Informatique"
          />
        </div>

        <div>
          <label htmlFor="niveau">Niveau *</label>
          <input
            id="niveau"
            name="niveau"
            value={form.niveau}
            onChange={handleChange}
            maxLength={50}
            required
            placeholder="Ex. Licence 2"
          />
        </div>

        <div>
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={form.description}
            onChange={handleChange}
            maxLength={500}
            rows={3}
            placeholder="Description du programme (facultatif)"
          />
        </div>

        <button type="submit" disabled={saving}>
          {saving
            ? 'Enregistrement...'
            : editingId
              ? 'Enregistrer les modifications'
              : 'Créer le programme'}
        </button>

        {editingId && (
          <button type="button" onClick={resetForm} disabled={saving}>
            Annuler
          </button>
        )}
      </form>

      <hr />

      <div>
        <h2>Liste des programmes ({filteredProgrammes.length})</h2>

        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Rechercher par code, nom ou niveau..."
          aria-label="Rechercher un programme"
        />

        <button
          type="button"
          onClick={() => void loadProgrammes()}
          disabled={loading}
        >
          {loading ? 'Chargement...' : 'Actualiser'}
        </button>
      </div>

      {loading && <p>Chargement des programmes...</p>}

      {!loading && filteredProgrammes.length === 0 && (
        <p>Aucun programme trouvé.</p>
      )}

      {!loading && filteredProgrammes.length > 0 && (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Code</th>
                <th>Nom</th>
                <th>Niveau</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProgrammes.map((programme) => (
                <tr key={programme.id}>
                  <td>{programme.code}</td>
                  <td>{programme.nom}</td>
                  <td>{programme.niveau}</td>
                  <td>{programme.description || '—'}</td>
                  <td>
                    <div
                      style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        alignItems: 'center',
                        gap: '8px',
                      }}
                    >
                      <button
                        type="button"
                        onClick={() => handleEdit(programme)}
                      >
                        Modifier
                      </button>

                      <button
                        type="button"
                        onClick={() => void handleDelete(programme.id)}
                      >
                        Supprimer
                      </button>
                    </div>
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