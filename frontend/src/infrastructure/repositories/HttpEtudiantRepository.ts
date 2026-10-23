import { apiClient } from '../http/apiClient';
import type { Etudiant } from '../../domain/entities/Etudiant';
import type { EtudiantRepository } from '../../domain/repositories/EtudiantRepository';

export class HttpEtudiantRepository implements EtudiantRepository {
  async list(): Promise<Etudiant[]> {
    const { data } = await apiClient.get<Etudiant[]>('/etudiants');
    return data;
  }

  async getById(id: string): Promise<Etudiant> {
    const { data } = await apiClient.get<Etudiant>(`/etudiants/${id}`);
    return data;
  }

  async create(etudiant: {
    matricule: string;
    nom: string;
    prenom: string;
    email: string;
  }): Promise<Etudiant> {
    const { data } = await apiClient.post<Etudiant>('/etudiants', etudiant);
    return data;
  }

  async update(
    id: string,
    etudiant: Partial<{
      matricule: string;
      nom: string;
      prenom: string;
      email: string;
    }>
  ): Promise<Etudiant> {
    const { data } = await apiClient.patch<Etudiant>(
      `/etudiants/${id}`,
      etudiant
    );
    return data;
  }

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/etudiants/${id}`);
  }
}
