import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Megaphone, 
  BookOpen, 
  FileText, 
  Clock, 
  CreditCard, 
  QrCode, 
  LogOut 
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <aside className="w-72 bg-slate-900 text-slate-200 flex flex-col shadow-xl h-screen sticky top-0">
      <div className="p-6 border-b border-slate-800">
        <h1 className="text-xl font-bold text-white tracking-wide">ENI - Espace Étudiant</h1>
        <p className="text-xs text-slate-400 mt-1">Filière Informatique Générale</p>
      </div>

      <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-1">
        <Link 
          to="/annonces" 
          className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
            isActive('/annonces') ? 'bg-blue-600 text-white shadow-md' : 'hover:bg-slate-800 hover:text-white'
          }`}
        >
          <Megaphone className="w-5 h-5 text-indigo-400" />
          <span>Annonces & Actualités</span>
        </Link>

        <Link 
          to="/programme" 
          className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
            isActive('/programme') ? 'bg-blue-600 text-white shadow-md' : 'hover:bg-slate-800 hover:text-white'
          }`}
        >
          <BookOpen className="w-5 h-5 text-emerald-400" />
          <span>Programme & Cours</span>
        </Link>

        <Link 
          to="/evaluations" 
          className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
            isActive('/evaluations') ? 'bg-blue-600 text-white shadow-md' : 'hover:bg-slate-800 hover:text-white'
          }`}
        >
          <FileText className="w-5 h-5 text-yellow-400" />
          <span>Évaluations & Résultats</span>
        </Link>

        <Link 
          to="/presence" 
          className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
            isActive('/presence') ? 'bg-blue-600 text-white shadow-md' : 'hover:bg-slate-800 hover:text-white'
          }`}
        >
          <Clock className="w-5 h-5 text-cyan-400" />
          <span>Présence & Assiduité</span>
        </Link>

        <Link 
          to="/scolarite" 
          className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
            isActive('/scolarite') ? 'bg-blue-600 text-white shadow-md' : 'hover:bg-slate-800 hover:text-white'
          }`}
        >
          <CreditCard className="w-5 h-5 text-orange-400" />
          <span>Scolarité & Paiement</span>
        </Link>

        <Link 
          to="/certificat" 
          className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
            isActive('/certificat') ? 'bg-blue-600 text-white shadow-md' : 'hover:bg-slate-800 hover:text-white'
          }`}
        >
          <QrCode className="w-5 h-5 text-purple-400" />
          <span>Mon Certificat QR</span>
        </Link>
      </nav>

      <div className="p-4 border-t border-slate-800">
        <button className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-red-600/20 hover:text-red-400 text-slate-300 py-2.5 px-4 rounded-lg text-sm font-medium transition-all">
          <LogOut className="w-4 h-4" />
          <span>Déconnexion</span>
        </button>
      </div>
    </aside>
  );
};