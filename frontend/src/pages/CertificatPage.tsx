import React from 'react';
import { QrCode, ShieldCheck, Printer } from 'lucide-react';

export const CertificatPage: React.FC = () => {
  // Données de l'étudiant (pourront être connectées à ton API NestJS plus tard)
  const student = {
    nom: "Rosseto Gabriel",
    prenom: "Calvin Nomenjanahary",
    numeroEtudiant: "ENI/IG/2026-005",
    filiere: "Informatique Générale (L2)",
    anneeUniversitaire: "2025-2026",
    statut: "Inscrit / En règle"
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-10">
      {/* En-tête de la page */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <QrCode className="w-7 h-7 text-purple-600" />
            Mon Certificat QR
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Attestation officielle de scolarité avec QR Code de vérification infalsifiable.
          </p>
        </div>
        <button 
          onClick={handlePrint}
          className="flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm"
        >
          <Printer className="w-4 h-4" />
          <span>Imprimer / Télécharger PDF</span>
        </button>
      </div>

      {/* Corps du certificat (Document officiel) */}
      <div className="bg-white p-8 md:p-12 rounded-2xl shadow-md border border-gray-200 relative overflow-hidden">
        {/* Badge de sécurité */}
        <div className="absolute top-6 right-6 flex items-center gap-1.5 bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-xs font-semibold border border-emerald-200">
          <ShieldCheck className="w-4 h-4" />
          <span>Authentifié par l'ENI</span>
        </div>

        {/* En-tête institutionnel */}
        <div className="text-center border-b border-gray-200 pb-6 mb-8">
          <h2 className="text-xs uppercase tracking-widest text-gray-400 font-semibold">République de Madagascar</h2>
          <h3 className="text-sm font-bold text-gray-700 mt-1">Ministère de l'Enseignement Supérieur et de la Recherche Scientifique</h3>
          <h4 className="text-lg font-extrabold text-blue-900 mt-2">École Nationale d'Informatique (ENI) - Toliara</h4>
        </div>

        {/* Titre du document */}
        <div className="text-center my-6">
          <h2 className="text-2xl font-serif font-bold text-gray-800 tracking-wide underline decoration-blue-500 underline-offset-8">
            ATTESTATION DE SCOLARITÉ
          </h2>
          <p className="text-sm text-gray-500 mt-2">Année Universitaire : {student.anneeUniversitaire}</p>
        </div>

        {/* Contenu textuel et informations */}
        <div className="my-8 space-y-4 text-gray-700 text-base leading-relaxed">
          <p>
            Le Directeur de l'École Nationale d'Informatique (ENI) certifie par la présente que l'étudiant(e) :
          </p>
          
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
            <div>
              <span className="text-xs text-gray-400 block font-medium">Nom et Prénoms :</span>
              <span className="font-bold text-gray-900 text-lg">{student.nom} {student.prenom}</span>
            </div>
            <div>
              <span className="text-xs text-gray-400 block font-medium">Numéro d'Étudiant :</span>
              <span className="font-bold text-gray-900 text-lg">{student.numeroEtudiant}</span>
            </div>
            <div>
              <span className="text-xs text-gray-400 block font-medium">Filière / Niveau :</span>
              <span className="font-bold text-gray-900">{student.filiere}</span>
            </div>
            <div>
              <span className="text-xs text-gray-400 block font-medium">Statut Administratif :</span>
              <span className="font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded inline-block mt-1">
                {student.statut}
              </span>
            </div>
          </div>

          <p>
            Est régulièrement inscrit(e) au titre de l'année universitaire en cours pour suivre les enseignements de la filière Informatique Générale. 
            Cette attestation est délivrée à l'intéressé(e) pour servir et valoir ce que de droit.
          </p>
        </div>

        {/* Pied du certificat avec QR Code */}
        <div className="mt-12 pt-6 border-t border-gray-200 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-xs text-gray-500 space-y-1">
            <p>Fait à Toliara, le {new Date().toLocaleDateString('fr-FR')}</p>
            <p className="italic">Ce document est muni d'un code de vérification numérique infalsifiable.</p>
          </div>

          {/* Représentation visuelle du QR Code */}
          <div className="flex flex-col items-center bg-gray-50 p-4 rounded-xl border border-gray-200 shadow-inner">
            <div className="w-28 h-28 bg-white p-2 rounded-lg border border-gray-300 flex items-center justify-center shadow-sm">
              <div className="w-full h-full bg-slate-900 grid grid-cols-4 gap-1 p-1">
                <div className="bg-white"></div><div className="bg-slate-900"></div><div className="bg-white"></div><div className="bg-slate-900"></div>
                <div className="bg-slate-900"></div><div className="bg-white"></div><div className="bg-slate-900"></div><div className="bg-white"></div>
                <div className="bg-white"></div><div className="bg-slate-900"></div><div className="bg-white"></div><div className="bg-slate-900"></div>
                <div className="bg-slate-900"></div><div className="bg-white"></div><div className="bg-slate-900"></div><div className="bg-white"></div>
              </div>
            </div>
            <span className="text-[10px] text-gray-400 mt-2 font-mono">ID: ENI-VRT-2026</span>
          </div>
        </div>
      </div>
    </div>
  );
};