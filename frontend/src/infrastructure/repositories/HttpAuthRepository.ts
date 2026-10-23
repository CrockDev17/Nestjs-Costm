import { apiClient } from '../http/apiClient';
import { TokenStorage } from '../auth/TokenStorage';
import type {
  AuthResponse,
  LoginCredentials,
} from '../../domain/entities/User';
import type { AuthRepository } from '../../domain/repositories/AuthRepository';

export class HttpAuthRepository implements AuthRepository {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const { data } = await apiClient.post<AuthResponse>(
      '/auth/login',
      credentials,
    );

    if (!data.access_token) {
      throw new Error('Le serveur n’a pas retourné de token.');
    }

    TokenStorage.set(data.access_token);
    return data;
  }
}