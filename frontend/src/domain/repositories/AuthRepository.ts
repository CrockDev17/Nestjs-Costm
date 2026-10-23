import type {
  AuthResponse,
  LoginCredentials,
} from '../entities/User';

export interface AuthRepository {
  login(credentials: LoginCredentials): Promise<AuthResponse>;
}