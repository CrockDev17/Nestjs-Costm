import type {
  AuthResponse,
  LoginCredentials,
} from '../../domain/entities/User';

import type { AuthRepository } from '../../domain/repositories/AuthRepository';

export class LoginUseCase {
  private readonly repository: AuthRepository;

  constructor(repository: AuthRepository) {
    this.repository = repository;
  }

  execute(credentials: LoginCredentials): Promise<AuthResponse> {
    return this.repository.login(credentials);
  }
}