import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Bell, Calendar, Megaphone } from 'lucide-react';

interface Annonce {
  id: string;
  titre: string;
  contenu: string;
  date: string;
  categorie: string;
}

export const AnnoncesPage: React.FC = () => {
  const [annonces, setAnnonces] = useState<Annonce[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchAnnonces();
  }, []);

  const fetchAnnonces = async () => {
    try {
      setLoading(true);
      const response = await api.get('/annonces');
      setAnnonces(response.data);
    } catch (err) {
      // Données de secours (Mock data) en attendant l'API NestJS
      setAnnonces([
        {
          id: '1',
          titre: 'Planning des examens de rattrapage - Session 2',
          contenu: 'Les examens de la session de rattrapage pour les filières Informatique Générale débuteront le mois prochain. Veuillez consulter le panneau d’affichage pour les salles.',
          date: '28 Septembre 2026',
          categorie: 'Scolarité'
        },
        {
          id: '2',
          titre: 'Appel à candidatures pour les stages techniques',
          contenu: 'La direction des stages informe les étudiants qu’il est possible de déposer les demandes de stage conventionnées auprès du secrétariat.',
          date: '20 Septembre 2026',
          categorie: 'Stages'
        },
        {
          id: '3',
          titre: 'Atelier pratique : Architecture des applications web modernes',
          contenu: 'Un atelier spécial sur NestJS et React aura lieu ce vendredi dans l’enceinte de l’établissement.',
          date: '15 Septembre 2026',
          categorie: 'Événement'
        }
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
            <Bell className="w-7 h-7 text-indigo-600" />
            Annonces & Actualités
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Restez informé des dernières actualités de l'école et de l'université.
          </p>
        </div>
      </div>

      {loading && (
        <div className="bg-white p-10 rounded-xl text-center text-gray-500 shadow-sm border border-gray-200">
          Chargement des annonces...
        </div>
      )}

      {!loading && (
        <div className="space-y-4">
          {annonces.map((annonce) => (
            <div key={annonce.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-full border border-indigo-200">
                  {annonce.categorie}
                </span>
                <span className="text-xs text-gray-400 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" /> {annonce.date}
                </span>
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2 flex items-center gap-2">
                <Megaphone className="w-5 h-5 text-indigo-500" />
                {annonce.titre}
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {annonce.contenu}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};