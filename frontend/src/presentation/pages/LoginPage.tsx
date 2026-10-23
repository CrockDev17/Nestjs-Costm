import { useState } from 'react';
import type { FormEvent } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { loginUseCase } from '../di/containers';

export default function LoginPage() {
  const location = useLocation();
  const navigate = useNavigate();


  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);


  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      await loginUseCase.execute({ email: email.trim(), password });
      const destination = (location.state as { from?: string } | null)?.from;
      navigate(destination?.startsWith('/pointage/') ? destination : '/dashboard', {
        replace: true,
      });
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const status = err.response?.status;
        const data = err.response?.data as
          | { message?: string | string[]; error?: string }
          | undefined;

        const serverMessage = Array.isArray(data?.message)
          ? data.message.join(', ')
          : data?.message;

        if (!err.response) {
          setError(
            'Le serveur est inaccessible. Vérifiez que le backend NestJS fonctionne sur http://localhost:3000.',
          );
        } else if (status === 401) {
          setError('E-mail ou mot de passe incorrect.');
        } else if (status === 404) {
          setError(
            'Route de connexion introuvable (404). Vérifiez le chemin de l’API.',
          );
        } else {
          setError(
            serverMessage ||
            data?.error ||
            `Échec de connexion (HTTP ${status ?? 'inconnu'}).`,
          );
        }
      } else {
        setError(
          err instanceof Error
            ? err.message
            : 'Une erreur inattendue est survenue.',
        );
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="login-container">
      <section className="login-brand">
        <div className="brand-logo">
          <div className="brand-emblem" aria-hidden="true">C</div>
          <div>
            <strong>COSTM</strong>
            <span>CENTRE D’ORIENTATION<br />SYSTÈME TECHNOLOGIE MODERNE</span>
          </div>
        </div>

        <div className="brand-message">
          <h1 className="login-gold-title">Connectez-vous à votre avenir</h1>
          <p>
            Votre plateforme de gestion académique et de suivi de la scolarité,
            réunie dans un espace simple et sécurisé.
          </p>
        </div>

        <div className="brand-features">
          <div className="brand-feature">
            <strong>Étudiants</strong>
            <p>Suivi et gestion des dossiers académiques.</p>
          </div>
          <div className="brand-feature">
            <strong>Programmes</strong>
            <p>Consultation des formations et parcours.</p>
          </div>
          <div className="brand-feature">
            <strong>Diplômes</strong>
            <p>Certificats et vérification par QR code.</p>
          </div>
        </div>
      </section>

      <section className="login-panel">
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="login-emblem" aria-hidden="true">C</div>

          <h1>Bienvenue au COSTM</h1>
          <p className="login-subtitle">
            Connectez-vous à votre espace
          </p>

          {error && (
            <div className="error-message" role="alert">
              {error}
            </div>
          )}

          <label htmlFor="email">Adresse e-mail</label>
          <input
            id="email"
            type="email"
            autoComplete="username"
            placeholder="exemple@costm.mg"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />

          <label htmlFor="password">Mot de passe</label>
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            placeholder="Votre mot de passe"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />

          <label className="password-toggle">
            <input
              type="checkbox"
              checked={showPassword}
              onChange={(event) => setShowPassword(event.target.checked)}
            />
            Afficher le mot de passe
          </label>

          <button type="submit" disabled={loading}>
            {loading ? 'Connexion en cours…' : 'Se connecter'}
          </button>

          <p className="login-security">◆ Accès sécurisé · COSTM</p>
        </form>
      </section>
    </main>
  );
}

