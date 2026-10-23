import { apiClient } from '../http/apiClient';
import type {
  Diplome,
  DiplomaVerification,
} from '../../domain/entities/Diplome';
import type { DiplomeRepository } from '../../domain/repositories/DiplomeRepository';

export class HttpDiplomeRepository implements DiplomeRepository {
  async list(): Promise<Diplome[]> {
    const { data } = await apiClient.get<Diplome[]>('/diplomes');
    return data;
  }

  async verify(reference: string): Promise<DiplomaVerification> {
    const { data } = await apiClient.get<DiplomaVerification>(
      `/diplomes/verify/${encodeURIComponent(reference)}`,
    );

    return data;
  }
}