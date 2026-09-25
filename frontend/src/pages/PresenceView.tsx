import React, { useEffect, useState } from 'react';
import api from '../services/api';

interface Presence {
  id: string;
  statut: string;
  date: string;
  justification: string | null;
  etudiant: {
    id: string;
    matricule: string;
  };
}

export const PresencesView: React.FC = () => {
  const [presences, setPresences] = useState<Presence[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPresences();
  }, []);

  const fetchPresences = async () => {
    try {
      setLoading(true);
      const response = await api.get('/presences');
      setPresences(response.data);
      setError(null);
    } catch (err: any) {
      setError("Impossible de charger les présences. Vérifiez votre connexion ou votre token.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1 style={{ color: '#1e293b', marginBottom: '1rem' }}>⏱️ Présence & Assiduité</h1>

      {loading && <p>Chargement des données...</p>}
      {error && <p style={{ color: '#ef4444', fontWeight: 'bold' }}>{error}</p>}

      {!loading && !error && (
        <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', borderRadius: '8px', overflow: 'hidden' }}>
          <thead>
            <tr style={{ backgroundColor: '#0f172a', color: '#fff', textAlign: 'left' }}>
              <th style={{ padding: '12px' }}>Matricule Étudiant</th>
              <th style={{ padding: '12px' }}>Date</th>
              <th style={{ padding: '12px' }}>Statut</th>
              <th style={{ padding: '12px' }}>Justification</th>
            </tr>
          </thead>
          <tbody>
            {presences.map((p) => (
              <tr key={p.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                <td style={{ padding: '12px', fontWeight: 'bold' }}>{p.etudiant?.matricule || 'N/A'}</td>
                <td style={{ padding: '12px' }}>{p.date}</td>
                <td style={{ padding: '12px' }}>
                  <span style={{
                    padding: '4px 8px',
                    borderRadius: '4px',
                    backgroundColor: p.statut === 'PRESENT' ? '#dcfce7' : '#fee2e2',
                    color: p.statut === 'PRESENT' ? '#15803d' : '#b91c1c',
                    fontWeight: 'bold',
                    fontSize: '0.85rem'
                  }}>
                    {p.statut}
                  </span>
                </td>
                <td style={{ padding: '12px', color: '#64748b' }}>{p.justification || 'Aucune'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};