import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Megaphone, 
  Target, 
  BookOpen, 
  FileText, 
  Clock, 
  CreditCard, 
  GraduationCap, 
  User 
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const location = useLocation();

  // Liste des liens du menu étudiant basés sur votre maquette
  const menuItems = [
    { path: '/student/annonces- generales', name: 'Annonces Générales', icon: Megaphone },
    { path: '/student/annonces-specifiques', name: 'Annonces Spécifiques', icon: Target },
    { path: '/student/programme', name: 'Programme & Cours', icon: BookOpen },
    { path: '/student/evaluations', name: 'Évaluations & Résultats', icon: FileText },
    { path: '/student/presence', name: 'Présence & Assiduité', icon: Clock },
    { path: '/student/scolarite', name: 'Scolarité & Paiement', icon: CreditCard },
    { path: '/student/certificat', name: 'Mon Certificat QR', icon: GraduationCap },
    { path: '/student/profil', name: 'Profil & Notifications', icon: User },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-white flex flex-col h-screen shadow-xl">
      {/* En-tête de la Sidebar */}
      <div className="p-6 border-b border-slate-800">
        <h1 className="text-xl font-bold text-indigo-400">Espace Étudiant</h1>
        <p className="text-xs text-slate-400 mt-1">Plateforme Pédagogique</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                isActive 
                  ? 'bg-indigo-600 text-white shadow-md' 
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Pied de la Sidebar */}
      <div className="p-4 border-t border-slate-800 text-xs text-slate-500 text-center">
        ENI - Informatique Générale
      </div>
    </aside>
  );
};