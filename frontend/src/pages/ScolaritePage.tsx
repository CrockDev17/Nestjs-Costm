import React from 'react';
import { CreditCard, DollarSign, CheckCircle } from 'lucide-react';

export const ScolaritePage: React.FC = () => {
  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-10">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <CreditCard className="w-7 h-7 text-indigo-600" />
            Scolarité & Paiement
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Suivi de vos droits d'inscription et historique des paiements de scolarité.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
        <h3 className="text-lg font-bold text-gray-800 border-b pb-4 flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-emerald-600" />
          État des Paiements (Année Universitaire 2026)
        </h3>
        <div className="flex items-center justify-between p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
          <div>
            <p className="text-sm font-bold text-emerald-800">Droits d'inscription - Soldés</p>
            <p className="text-xs text-emerald-600 mt-0.5">Payé par Mobile Money / Reçu validé par la scolarité</p>
          </div>
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-600 text-white text-xs font-semibold rounded-full">
            <CheckCircle className="w-4 h-4" /> Validé
          </span>
        </div>
      </div>
    </div>
  );
};