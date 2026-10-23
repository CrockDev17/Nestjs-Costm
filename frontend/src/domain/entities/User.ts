export type UserRole = 'ADMIN' | 'ETUDIANT';

export interface User {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  role: UserRole;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  user?: User;
}