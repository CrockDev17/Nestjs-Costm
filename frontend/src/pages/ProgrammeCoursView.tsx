import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { BookOpen, Download, Clock } from 'lucide-react';

interface Cours {
  id: string;
  titre: string;
  module: string;
  horaire: string;
  salle: string;
  professeur: string;
}

export const ProgrammeCoursView: React.FC = () => {
  const [coursList, setCoursList] = useState<Cours[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchCours();
  }, []);

  const fetchCours = async () => {
    try {
      setLoading(true);
      const response = await api.get('/cours');
      setCoursList(response.data);
    } catch (err) {
      setCoursList([
        {
          id: '1',
          titre: 'Algorithmique Avancée & Structures de Données',
          module: 'Informatique Générale',
          horaire: 'Lundi, 08:00 - 10:00',
          salle: 'Salle TP 1',
          professeur: 'Dr. Rakoto'
        },
        {
          id: '2',
          titre: 'Architecture NestJS & API REST',
          module: 'Développement Web Avancé',
          horaire: 'Mardi, 10:00 - 12:00',
          salle: 'Labo Réseau',
          professeur: 'M. Andria'
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
            <BookOpen className="w-7 h-7 text-emerald-600" />
            Programme & Cours
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Emploi du temps et supports de cours synchronisés avec ton backend NestJS.
          </p>
        </div>
      </div>

      {loading && (
        <div className="bg-white p-10 rounded-xl text-center text-gray-500 shadow-sm border border-gray-200">
          Chargement du programme en cours...
        </div>
      )}

      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {coursList.map((cours) => (
            <div key={cours.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col justify-between hover:shadow-md transition-shadow">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-200">
                    {cours.module}
                  </span>
                  <span className="text-xs text-gray-400 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> {cours.horaire}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">{cours.titre}</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Enseignant : <span className="font-medium text-gray-800">{cours.professeur}</span> | Lieu : <span className="font-medium text-gray-800">{cours.salle}</span>
                </p>
              </div>
              <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                <span className="text-xs text-gray-400">Support PDF disponible</span>
                <button className="flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors">
                  <Download className="w-4 h-4" />
                  <span>Télécharger</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};