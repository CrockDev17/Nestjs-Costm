import { useCallback, useEffect, useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import type {
  Annonce,
  AnnoncePayload,
  AnnonceStatut,
  AnnonceType,
} from '../../domain/entities/Annonce';
import {
  createAnnonceUseCase,
  listAnnoncesUseCase,
  updateAnnonceUseCase,
  deleteAnnonceUseCase,
} from '../di/containers';

type FormState = {
  titre: string;
  contenu: string;
  type: AnnonceType;
  dateEvenement: string;
  lieu: string;
  dateExpiration: string;
  statut: AnnonceStatut;
};

const emptyForm: FormState = {
  titre: '',
  contenu: '',
  type: 'INFORMATION',
  dateEvenement: '',
  lieu: '',
  dateExpiration: '',
  statut: 'BROUILLON',
};

const types: { value: AnnonceType; label: string }[] = [
  { value: 'INFORMATION', label: 'Information' },
  { value: 'EVENEMENT', label: 'Événement' },
  { value: 'EXAMEN', label: 'Examen' },
  { value: 'REUNION', label: 'Réunion' },
  { value: 'AUTRE', label: 'Autre' },
];

const statuses: { value: AnnonceStatut; label: string }[] = [
  { value: 'BROUILLON', label: 'Brouillon' },
  { value: 'PUBLIEE', label: 'Publiée' },
  { value: 'ARCHIVEE', label: 'Archivée' },
];

const statusColors: Record<AnnonceStatut, { color: string; background: string }> = {
  BROUILLON: { color: '#92400e', background: '#fef3c7' },
  PUBLIEE: { color: '#166534', background: '#dcfce7' },
  ARCHIVEE: { color: '#475569', background: '#e2e8f0' },
};

const inputStyle = {
  width: '100%',
  boxSizing: 'border-box' as const,
  padding: '11px 12px',
  border: '1px solid #dbe2ea',
  borderRadius: 10,
  background: '#fff',
  color: '#172033',
  font: 'inherit',
};

const labelStyle = {
  display: 'block',
  marginBottom: 6,
  color: '#475569',
  fontSize: 13,
  fontWeight: 600 as const,
};

function formatDate(value: string | null | undefined): string {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return new Intl.DateTimeFormat('fr-FR', {
    dateStyle: 'medium',
    timeStyle: value.includes('T') ? 'short' : undefined,
  }).format(date);
}

function toLocalDateTime(value: string | null): string {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return localDate.toISOString().slice(0, 16);
}

function errorMessage(error: unknown): string {
  const candidate = error as {
    response?: { data?: { message?: string | string[] } };
    message?: string;
  };
  const message = candidate?.response?.data?.message ?? candidate?.message;
  return Array.isArray(message) ? message.join(', ') : message ?? 'Une erreur est survenue.';
}

export default function AnnoncesPage() {
  const [annonces, setAnnonces] = useState<Annonce[]>([]);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'TOUTES' | AnnonceStatut>('TOUTES');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const loadAnnonces = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await listAnnoncesUseCase.execute();
      setAnnonces(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadAnnonces();
  }, [loadAnnonces]);

  const filteredAnnonces = useMemo(() => {
    const term = search.trim().toLocaleLowerCase('fr');
    return annonces.filter((annonce) => {
      const matchesStatus = filter === 'TOUTES' || annonce.statut === filter;
      const matchesSearch =
        !term ||
        annonce.titre.toLocaleLowerCase('fr').includes(term) ||
        annonce.contenu.toLocaleLowerCase('fr').includes(term) ||
        (annonce.lieu ?? '').toLocaleLowerCase('fr').includes(term);
      return matchesStatus && matchesSearch;
    });
  }, [annonces, filter, search]);

  const counts = useMemo(() => ({
    total: annonces.length,
    publiees: annonces.filter((item) => item.statut === 'PUBLIEE').length,
    brouillons: annonces.filter((item) => item.statut === 'BROUILLON').length,
    archivees: annonces.filter((item) => item.statut === 'ARCHIVEE').length,
  }), [annonces]);

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function startEdit(annonce: Annonce) {
    setEditingId(annonce.id);
    setForm({
      titre: annonce.titre,
      contenu: annonce.contenu,
      type: annonce.type,
      dateEvenement: toLocalDateTime(annonce.dateEvenement),
      lieu: annonce.lieu ?? '',
      dateExpiration: toLocalDateTime(annonce.dateExpiration),
      statut: annonce.statut,
    });
    setSuccess('');
    setError('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function resetForm() {
    setEditingId(null);
    setForm(emptyForm);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    const payload: AnnoncePayload = {
      titre: form.titre.trim(),
      contenu: form.contenu.trim(),
      type: form.type,
      lieu: form.lieu.trim() || null,
      dateEvenement: form.dateEvenement
        ? new Date(form.dateEvenement).toISOString()
        : null,
      dateExpiration: form.dateExpiration
        ? new Date(form.dateExpiration).toISOString()
        : null,
      statut: form.statut,
    };

    try {
      if (editingId) {
        await updateAnnonceUseCase.execute(editingId, payload);
        setSuccess('Annonce modifiée avec succès.');
      } else {
        await createAnnonceUseCase.execute(payload);
        setSuccess('Annonce créée avec succès.');
      }
      resetForm();
      await loadAnnonces();
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  async function changeStatus(annonce: Annonce, statut: AnnonceStatut) {
    setError('');
    setSuccess('');
    try {
      await updateAnnonceUseCase.execute(annonce.id, { statut });
      setSuccess(`Statut mis à jour : ${statuses.find((item) => item.value === statut)?.label}.`);
      await loadAnnonces();
    } catch (err) {
      setError(errorMessage(err));
    }
  }

  async function removeAnnonce(annonce: Annonce) {
    const confirmed = window.confirm(
      `Supprimer définitivement l'annonce « ${annonce.titre} » ?`,
    );
    if (!confirmed) return;

    setError('');
    setSuccess('');
    try {
      await deleteAnnonceUseCase.execute(annonce.id);
      if (editingId === annonce.id) resetForm();
      setSuccess('Annonce supprimée.');
      await loadAnnonces();
    } catch (err) {
      setError(errorMessage(err));
    }
  }

  const buttonStyle = (background: string, color = '#fff') => ({
    border: 'none',
    borderRadius: 9,
    padding: '9px 12px',
    background,
    color,
    fontWeight: 700 as const,
    fontSize: 12,
    cursor: 'pointer',
  });

  return (
    <main style={{ maxWidth: 1400, margin: '0 auto', padding: '28px 22px 48px', color: '#172033' }}>
      <div style={{
        display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between',
        alignItems: 'center', gap: 16, marginBottom: 24,
      }}>
        <div>
          <p style={{ margin: '0 0 7px', color: '#4f46e5', fontSize: 12, fontWeight: 800, letterSpacing: 1.5 }}>
            ADMINISTRATION COSTM
          </p>
          <h1 style={{ margin: 0, fontSize: 30, letterSpacing: -0.8 }}>Annonces</h1>
          <p style={{ margin: '8px 0 0', color: '#64748b' }}>
            Publiez les informations importantes et gérez les communications de l’établissement.
          </p>
        </div>
        <button type="button" onClick={() => { resetForm(); setError(''); setSuccess(''); }}
          style={buttonStyle('#172554')} >
          + Nouvelle annonce
        </button>
      </div>

      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(155px, 1fr))',
        gap: 14, marginBottom: 24,
      }}>
        {[
          { label: 'Total des annonces', value: counts.total, color: '#4f46e5' },
          { label: 'Publiées', value: counts.publiees, color: '#15803d' },
          { label: 'Brouillons', value: counts.brouillons, color: '#b45309' },
          { label: 'Archivées', value: counts.archivees, color: '#64748b' },
        ].map((item) => (
          <div key={item.label} style={{
            padding: 19, borderRadius: 15, background: '#fff',
            border: '1px solid #e8edf3', boxShadow: '0 4px 18px rgba(15,23,42,.035)',
          }}>
            <div style={{ color: '#64748b', fontSize: 12, fontWeight: 600 }}>{item.label}</div>
            <div style={{ color: item.color, fontSize: 29, fontWeight: 800, marginTop: 8 }}>{item.value}</div>
          </div>
        ))}
      </div>

      {(error || success) && (
        <div role="alert" style={{
          padding: '12px 15px', marginBottom: 18, borderRadius: 10,
          background: error ? '#fef2f2' : '#f0fdf4',
          color: error ? '#b91c1c' : '#166534',
          border: `1px solid ${error ? '#fecaca' : '#bbf7d0'}`,
        }}>
          {error || success}
        </div>
      )}

      <section style={{
        background: '#fff', border: '1px solid #e8edf3', borderRadius: 16,
        padding: 22, marginBottom: 26, boxShadow: '0 4px 18px rgba(15,23,42,.035)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', marginBottom: 18 }}>
          <div>
            <h2 style={{ margin: 0, fontSize: 19 }}>{editingId ? 'Modifier l’annonce' : 'Créer une annonce'}</h2>
            <p style={{ margin: '5px 0 0', color: '#64748b', fontSize: 13 }}>
              Les champs marqués d’un * sont obligatoires.
            </p>
          </div>
          {editingId && (
            <button type="button" onClick={resetForm} style={buttonStyle('#f1f5f9', '#334155')}>
              Annuler la modification
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
            <div style={{ gridColumn: '1 / -1' }}>
              <label htmlFor="annonce-titre" style={labelStyle}>Titre *</label>
              <input id="annonce-titre" required maxLength={200} value={form.titre}
                onChange={(e) => updateField('titre', e.target.value)}
                placeholder="Ex. : Calendrier des examens de fin de semestre" style={inputStyle} />
            </div>

            <div>
              <label htmlFor="annonce-type" style={labelStyle}>Catégorie *</label>
              <select id="annonce-type" value={form.type}
                onChange={(e) => updateField('type', e.target.value as AnnonceType)} style={inputStyle}>
                {types.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
              </select>
            </div>

            <div>
              <label htmlFor="annonce-statut" style={labelStyle}>Statut *</label>
              <select id="annonce-statut" value={form.statut}
                onChange={(e) => updateField('statut', e.target.value as AnnonceStatut)} style={inputStyle}>
                {statuses.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
              </select>
            </div>

            <div>
              <label htmlFor="annonce-date" style={labelStyle}>Date de l’événement</label>
              <input id="annonce-date" type="datetime-local" value={form.dateEvenement}
                onChange={(e) => updateField('dateEvenement', e.target.value)} style={inputStyle} />
            </div>

            <div>
              <label htmlFor="annonce-lieu" style={labelStyle}>Lieu</label>
              <input id="annonce-lieu" maxLength={200} value={form.lieu}
                onChange={(e) => updateField('lieu', e.target.value)}
                placeholder="Ex. : Salle de conférence" style={inputStyle} />
            </div>

            <div>
              <label htmlFor="annonce-expiration" style={labelStyle}>Date d’expiration</label>
              <input id="annonce-expiration" type="datetime-local" value={form.dateExpiration}
                onChange={(e) => updateField('dateExpiration', e.target.value)} style={inputStyle} />
            </div>

            <div style={{ gridColumn: '1 / -1' }}>
              <label htmlFor="annonce-contenu" style={labelStyle}>Contenu de l’annonce *</label>
              <textarea id="annonce-contenu" required rows={5} value={form.contenu}
                onChange={(e) => updateField('contenu', e.target.value)}
                placeholder="Rédigez les informations à communiquer…" style={{ ...inputStyle, resize: 'vertical' }} />
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10, marginTop: 18, flexWrap: 'wrap' }}>
            <button type="submit" disabled={saving} style={{
              ...buttonStyle(saving ? '#94a3b8' : '#4f46e5'),
              padding: '11px 18px', cursor: saving ? 'wait' : 'pointer',
            }}>
              {saving ? 'Enregistrement…' : editingId ? 'Enregistrer les modifications' : 'Créer l’annonce'}
            </button>
            <button type="button" disabled={saving} onClick={() => {
              updateField('statut', 'BROUILLON');
            }} style={buttonStyle('#f1f5f9', '#334155')}>
              Préparer en brouillon
            </button>
          </div>
        </form>
      </section>

      <section style={{
        background: '#fff', border: '1px solid #e8edf3', borderRadius: 16,
        padding: 22, boxShadow: '0 4px 18px rgba(15,23,42,.035)',
      }}>
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          flexWrap: 'wrap', gap: 14, marginBottom: 20,
        }}>
          <div>
            <h2 style={{ margin: 0, fontSize: 19 }}>Toutes les annonces</h2>
            <p style={{ margin: '5px 0 0', color: '#64748b', fontSize: 13 }}>
              {filteredAnnonces.length} résultat(s)
            </p>
          </div>
          <button type="button" onClick={() => void loadAnnonces()} style={buttonStyle('#f1f5f9', '#334155')}>
            ↻ Actualiser
          </button>
        </div>

        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 12, marginBottom: 20,
        }}>
          <input aria-label="Rechercher une annonce" value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher par titre, contenu ou lieu…" style={inputStyle} />
          <select aria-label="Filtrer par statut" value={filter}
            onChange={(e) => setFilter(e.target.value as 'TOUTES' | AnnonceStatut)} style={inputStyle}>
            <option value="TOUTES">Tous les statuts</option>
            {statuses.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
          </select>
        </div>

        {loading ? (
          <p style={{ padding: 25, textAlign: 'center', color: '#64748b' }}>Chargement des annonces…</p>
        ) : filteredAnnonces.length === 0 ? (
          <div style={{ padding: '34px 16px', textAlign: 'center', background: '#f8fafc', borderRadius: 12 }}>
            <div style={{ fontSize: 30, marginBottom: 8 }}>▤</div>
            <strong>Aucune annonce trouvée</strong>
            <p style={{ color: '#64748b', marginBottom: 0, fontSize: 13 }}>
              Créez une annonce ou modifiez les critères de recherche.
            </p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: 14 }}>
            {filteredAnnonces.map((annonce) => {
              const badge = statusColors[annonce.statut];
              return (
                <article key={annonce.id} style={{
                  padding: 18, border: '1px solid #e8edf3', borderRadius: 13,
                  display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gap: 13,
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap' }}>
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 8 }}>
                        <span style={{ fontSize: 11, color: '#4f46e5', fontWeight: 800, textTransform: 'uppercase', letterSpacing: .7 }}>
                          {types.find((item) => item.value === annonce.type)?.label ?? annonce.type}
                        </span>
                        <span style={{
                          padding: '4px 8px', borderRadius: 999, fontSize: 11,
                          fontWeight: 800, color: badge.color, background: badge.background,
                        }}>
                          {statuses.find((item) => item.value === annonce.statut)?.label}
                        </span>
                      </div>
                      <h3 style={{ margin: '0 0 8px', fontSize: 17, overflowWrap: 'anywhere' }}>{annonce.titre}</h3>
                      <p style={{ margin: 0, color: '#475569', whiteSpace: 'pre-wrap', lineHeight: 1.6, overflowWrap: 'anywhere' }}>
                        {annonce.contenu}
                      </p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: 15, flexWrap: 'wrap', color: '#64748b', fontSize: 12 }}>
                    <span>◷ Événement : {formatDate(annonce.dateEvenement)}</span>
                    <span>⌖ Lieu : {annonce.lieu || 'Non précisé'}</span>
                    <span>Publication : {formatDate(annonce.datePublication)}</span>
                    {annonce.dateExpiration && <span>Expiration : {formatDate(annonce.dateExpiration)}</span>}
                  </div>

                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', paddingTop: 12, borderTop: '1px solid #eef2f7' }}>
                    <button type="button" onClick={() => startEdit(annonce)} style={buttonStyle('#eef2ff', '#4338ca')}>
                      Modifier
                    </button>
                    {annonce.statut !== 'PUBLIEE' && (
                      <button type="button" onClick={() => void changeStatus(annonce, 'PUBLIEE')}
                        style={buttonStyle('#15803d')}>
                        Publier
                      </button>
                    )}
                    {annonce.statut !== 'BROUILLON' && (
                      <button type="button" onClick={() => void changeStatus(annonce, 'BROUILLON')}
                        style={buttonStyle('#fef3c7', '#92400e')}>
                        Remettre en brouillon
                      </button>
                    )}
                    {annonce.statut !== 'ARCHIVEE' && (
                      <button type="button" onClick={() => void changeStatus(annonce, 'ARCHIVEE')}
                        style={buttonStyle('#e2e8f0', '#334155')}>
                        Archiver
                      </button>
                    )}
                    <button type="button" onClick={() => void removeAnnonce(annonce)}
                      style={buttonStyle('#fee2e2', '#b91c1c')}>
                      Supprimer
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
