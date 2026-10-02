import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Clock, CheckCircle2, XCircle } from 'lucide-react';

interface Presence {
  id: string;
  cours: string;
  date: string;
  heure: string;
  statut: string;
}

export const PresenceView: React.FC = () => {
  const [presences, setPresences] = useState<Presence[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchPresences();
  }, []);

  const fetchPresences = async () => {
    try {
      setLoading(true);
      const response = await api.get('/presence');
      setPresences(response.data);
    } catch (err) {
      setPresences([
        { id: '1', cours: 'Algorithmique Avancée', date: '28/09/2026', heure: '08:00 - 10:00', statut: 'Présent' },
        { id: '2', cours: 'Architecture NestJS', date: '26/09/2026', heure: '10:00 - 12:00', statut: 'Présent' },
        { id: '3', cours: 'Réseaux & Protocoles IP', date: '24/09/2026', heure: '14:00 - 16:00', statut: 'Absent' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-10">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Clock className="w-7 h-7 text-cyan-600" />
            Présence & Assiduité
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Suivi de votre présence aux cours magistraux et séances de travaux pratiques.
          </p>
        </div>
      </div>

      {loading && (
        <div className="bg-white p-10 rounded-xl text-center text-gray-500 shadow-sm border border-gray-200">
          Chargement du registre de présence...
        </div>
      )}

      {!loading && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-bold text-gray-800">Historique des émargements</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-200">
                  <th className="py-3 px-6">Cours / Module</th>
                  <th className="py-3 px-6">Date</th>
                  <th className="py-3 px-6">Horaire</th>
                  <th className="py-3 px-6">Statut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 text-sm text-gray-700">
                {presences.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-6 font-semibold text-gray-900">{item.cours}</td>
                    <td className="py-4 px-6 text-gray-500">{item.date}</td>
                    <td className="py-4 px-6 text-gray-500">{item.heure}</td>
                    <td className="py-4 px-6">
                      {item.statut === 'Présent' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Présent
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200">
                          <XCircle className="w-3.5 h-3.5" /> Absent
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};