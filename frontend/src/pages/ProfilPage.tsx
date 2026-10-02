import React from 'react';
import { User, MapPin, Shield, Bell, Lock } from 'lucide-react';

export const ProfilPage: React.FC = () => {
  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-10">
      {/* En-tête */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <User className="w-7 h-7 text-blue-600" />
            Profil & Notifications
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Gérez vos informations personnelles et vos préférences de notification.
          </p>
        </div>
      </div>

      {/* Informations personnelles */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
        <h3 className="text-lg font-bold text-gray-800 border-b pb-4 flex items-center gap-2">
          <Shield className="w-5 h-5 text-blue-600" />
          Informations Académiques & Personnelles
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-xs font-medium text-gray-400 block mb-1">Nom et Prénoms</label>
            <div className="text-gray-800 font-semibold bg-gray-50 p-3 rounded-lg border border-gray-200">
              Calvin Nomenjanahary Rosseto Gabriel
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-gray-400 block mb-1">Numéro d'Étudiant</label>
            <div className="text-gray-800 font-semibold bg-gray-50 p-3 rounded-lg border border-gray-200">
              ENI/IG/2026-005
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-gray-400 block mb-1">Filière / Niveau</label>
            <div className="text-gray-800 font-semibold bg-gray-50 p-3 rounded-lg border border-gray-200">
              Informatique Générale (L2) - ENI Toliara
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-gray-400 block mb-1">Quartier / Résidence</label>
            <div className="text-gray-800 font-semibold bg-gray-50 p-3 rounded-lg border border-gray-200 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-red-500" /> Tsianaloky, Toliara
            </div>
          </div>
        </div>
      </div>

      {/* Préférences de notifications */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
        <h3 className="text-lg font-bold text-gray-800 border-b pb-4 flex items-center gap-2">
          <Bell className="w-5 h-5 text-indigo-600" />
          Paramètres de Notification
        </h3>

        <div className="space-y-3">
          <label className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
            <span className="text-sm font-medium text-gray-700">Notifications par email pour les notes et résultats</span>
            <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500" />
          </label>
          <label className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
            <span className="text-sm font-medium text-gray-700">Alertes de présence et absences</span>
            <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500" />
          </label>
          <label className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
            <span className="text-sm font-medium text-gray-700">Annonces officielles de l'administration</span>
            <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500" />
          </label>
        </div>
      </div>

      {/* Sécurité */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
        <h3 className="text-lg font-bold text-gray-800 border-b pb-4 flex items-center gap-2">
          <Lock className="w-5 h-5 text-amber-600" />
          Sécurité du compte
        </h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-800">Mot de passe</p>
            <p className="text-xs text-gray-500">Dernière modification il y a 3 mois</p>
          </div>
          <button className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            Modifier le mot de passe
          </button>
        </div>
      </div>
    </div>
  );
};