import axios from 'axios';
import { apiClient } from '../http/apiClient';
import type { PresenceSession } from '../../domain/entities/PresenceSession';
import type { PresenceSessionRepository } from '../../domain/repositories/PresenceSessionRepository';

export class HttpPresenceSessionRepository implements PresenceSessionRepository {
  async create(cours: string): Promise<PresenceSession> {
    const response = await apiClient.post<PresenceSession>(
      '/presences/sessions',
      { cours },
    );
    return response.data;
  }

  async list(): Promise<PresenceSession[]> {
    const response = await apiClient.get<PresenceSession[]>('/presences/sessions');
    return response.data;
  }

  async close(id: string): Promise<PresenceSession> {
    const response = await apiClient.patch<PresenceSession>(
      `/presences/sessions/${id}/close`,
    );
    return response.data;
  }

  async scan(token: string): Promise<unknown> {
    try {
      const response = await apiClient.post(
        `/presences/sessions/${encodeURIComponent(token)}/scan`,
      );
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const data = error.response?.data as
          | { message?: string | string[] }
          | undefined;

        const serverMessage = Array.isArray(data?.message)
          ? data.message.join(' ')
          : data?.message;

        if (status === 409) {
          const detail = (serverMessage || '').toLowerCase();

          if (detail.includes('déjà enregistrée') || detail.includes('deja enregistree')) {
            throw new Error('Votre présence pour ce cours a déjà été enregistrée.');
          }

          if (detail.includes('fermée') || detail.includes('fermee') || detail.includes('clôturée') || detail.includes('cloturee')) {
            throw new Error('Le pointage de ce cours est terminé. Cette session a été clôturée par l’administration.');
          }

          if (detail.includes('expiré') || detail.includes('expire')) {
            throw new Error('Cette session de pointage a expiré. Veuillez demander à l’administration de générer un nouveau QR code.');
          }

          throw new Error(serverMessage || 'Le pointage est actuellement impossible pour cette session.');
        }

        if (status === 404) {
          throw new Error('Ce QR code est invalide ou n’existe plus. Scannez le QR code actif présenté par l’administration.');
        }

        if (status === 401 || status === 403) {
          throw new Error('Vous devez être connecté avec un compte étudiant autorisé pour enregistrer votre présence.');
        }

        if (!error.response) {
          throw new Error('Impossible de contacter le serveur. Vérifiez votre connexion puis réessayez.');
        }

        throw new Error(serverMessage || 'Une erreur est survenue pendant le pointage. Veuillez réessayer.');
      }

      throw error;
    }
  }
}

