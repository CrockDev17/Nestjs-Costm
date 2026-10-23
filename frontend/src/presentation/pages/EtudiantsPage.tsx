import { useCallback, useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { etudiantRepository } from '../di/containers';
import { apiClient } from '../../infrastructure/http/apiClient';
import type { Etudiant } from '../../domain/entities/Etudiant';

type FormulaireEtudiant = {
  matricule: string;
  nom: string;
  prenom: string;
  email: string;
};

const formulaireVide: FormulaireEtudiant = {
  matricule: '',
  nom: '',
  prenom: '',
  email: '',
};

function extraireErreur(error: unknown, messageParDefaut: string): string {
  const erreur = error as {
    response?: { data?: { message?: string | string[] } };
    message?: string;
  };

  const detail = erreur.response?.data?.message;

  if (Array.isArray(detail)) return detail.join(' ');
  if (detail) return detail;
  return erreur.message || messageParDefaut;
}

export default function EtudiantsPage() {
  const [etudiants, setEtudiants] = useState<Etudiant[]>([]);
  const [recherche, setRecherche] = useState('');
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState('');
  const [message, setMessage] = useState('');
  const [formulaire, setFormulaire] =
    useState<FormulaireEtudiant>(formulaireVide);
  const [etudiantEnEdition, setEtudiantEnEdition] =
    useState<Etudiant | null>(null);
  const [etudiantSelectionne, setEtudiantSelectionne] =
    useState<Etudiant | null>(null);
  const [envoi, setEnvoi] = useState(false);
  const [suppressionId, setSuppressionId] = useState<string | null>(null);
  const [etudiantPourCompte, setEtudiantPourCompte] = useState<Etudiant | null>(null);
  const [emailCompte, setEmailCompte] = useState('');
  const [motDePasseCompte, setMotDePasseCompte] = useState('');
  const [creationCompte, setCreationCompte] = useState(false);

  const chargerEtudiants = useCallback(async () => {
    setChargement(true);
    setErreur('');

    try {
      const resultat = await etudiantRepository.list();
      setEtudiants(resultat);
    } catch (error: unknown) {
      setErreur(
        extraireErreur(
          error,
          'Impossible de charger les étudiants. Vérifie le backend et ton accès administrateur.',
        ),
      );
    } finally {
      setChargement(false);
    }
  }, []);

  useEffect(() => {
    void chargerEtudiants();
  }, [chargerEtudiants]);

  function commencerModification(etudiant: Etudiant) {
    setEtudiantEnEdition(etudiant);
    setFormulaire({
      matricule: etudiant.matricule,
      nom: etudiant.nom,
      prenom: etudiant.prenom,
      email: etudiant.email,
    });
    setErreur('');
    setMessage('');
    setEtudiantSelectionne(null);

    document.getElementById('formulaire-etudiant')?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }

  function annulerModification() {
    setEtudiantEnEdition(null);
    setFormulaire(formulaireVide);
    setErreur('');
  }

  async function enregistrerEtudiant(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErreur('');
    setMessage('');
    setEnvoi(true);

    const donnees: FormulaireEtudiant = {
      matricule: formulaire.matricule.trim(),
      nom: formulaire.nom.trim(),
      prenom: formulaire.prenom.trim(),
      email: formulaire.email.trim(),
    };

    try {
      if (etudiantEnEdition) {
        await etudiantRepository.update(etudiantEnEdition.id, donnees);
        setMessage('Étudiant modifié avec succès.');
        setEtudiantEnEdition(null);
        setFormulaire(formulaireVide);
      } else {
        await etudiantRepository.create(donnees);
        setMessage('Étudiant créé avec succès.');
        setFormulaire(formulaireVide);
      }

      await chargerEtudiants();
    } catch (error: unknown) {
      setErreur(
        extraireErreur(
          error,
          etudiantEnEdition
            ? 'Échec de la modification de l’étudiant.'
            : 'Échec de la création de l’étudiant.',
        ),
      );
    } finally {
      setEnvoi(false);
    }
  }

  async function supprimerEtudiant(etudiant: Etudiant) {
    const confirmation = window.confirm(
      `Voulez-vous vraiment supprimer ${etudiant.prenom} ${etudiant.nom} (${etudiant.matricule}) ?\n\nCette action est définitive si le serveur l'autorise.`,
    );

    if (!confirmation) return;

    setErreur('');
    setMessage('');
    setSuppressionId(etudiant.id);

    try {
      await etudiantRepository.delete(etudiant.id);

      setMessage('Étudiant supprimé avec succès.');

      if (etudiantEnEdition?.id === etudiant.id) {
        setEtudiantEnEdition(null);
        setFormulaire(formulaireVide);
      }

      if (etudiantSelectionne?.id === etudiant.id) {
        setEtudiantSelectionne(null);
      }

      await chargerEtudiants();
    } catch (error: unknown) {
      setErreur(
        extraireErreur(
          error,
          'Impossible de supprimer cet étudiant.',
        ),
      );
    } finally {
      setSuppressionId(null);
    }
  }

  function ouvrirCreationCompte(etudiant: Etudiant) {
    setEtudiantPourCompte(etudiant);
    setEmailCompte(etudiant.email);
    setMotDePasseCompte('');
    setErreur('');
    setMessage('');

    document.getElementById('formulaire-compte-etudiant')?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }

  function fermerCreationCompte() {
    setEtudiantPourCompte(null);
    setEmailCompte('');
    setMotDePasseCompte('');
    setErreur('');
  }

  async function creerCompteEtudiant(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!etudiantPourCompte) return;

    setErreur('');
    setMessage('');
    setCreationCompte(true);

    try {
      await apiClient.post('/users/student-account', {
        email: emailCompte.trim(),
        password: motDePasseCompte,
        etudiantId: etudiantPourCompte.id,
      });

      setMessage('Compte étudiant créé avec succès. Communique ses identifiants de connexion de manière sécurisée.');
      setEtudiantPourCompte(null);
      setEmailCompte('');
      setMotDePasseCompte('');
    } catch (error: unknown) {
      setErreur(
        extraireErreur(
          error,
          'Impossible de créer le compte. Vérifie tes droits administrateur, le serveur et les informations saisies.',
        ),
      );
    } finally {
      setCreationCompte(false);
    }
  }
  const resultat = etudiants.filter((etudiant) => {
    const texte =
      `${etudiant.matricule} ${etudiant.nom} ${etudiant.prenom} ${etudiant.email}`;

    return texte.toLowerCase().includes(recherche.toLowerCase());
  });

  return (
    <section className="page-container">
      <div className="page-heading">
        <div>
          <h1>Gestion des étudiants</h1>
          <p>Consulte, enregistre et gère les étudiants du COSTM.</p>
        </div>

        <div className="stat-card">
          <span>Total étudiants</span>
          <strong>{etudiants.length}</strong>
        </div>
      </div>

      {erreur && (
        <div className="error-message" role="alert">
          {erreur}
        </div>
      )}

      {message && (
        <div className="success-message" role="status">
          {message}
        </div>
      )}

      {etudiantPourCompte && (
        <div className="content-card" id="formulaire-compte-etudiant">
          <h2>
            Créer un compte — {etudiantPourCompte.prenom} {etudiantPourCompte.nom}
          </h2>
          <p>
            Ce compte sera associé au dossier portant le matricule{' '}
            <strong>{etudiantPourCompte.matricule}</strong>.
          </p>

          <form onSubmit={creerCompteEtudiant} className="student-form">
            <label>
              E-mail de connexion
              <input
                type="email"
                autoComplete="username"
                value={emailCompte}
                onChange={(event) => setEmailCompte(event.target.value)}
                required
              />
            </label>

            <label>
              Mot de passe initial
              <input
                type="password"
                autoComplete="new-password"
                value={motDePasseCompte}
                onChange={(event) => setMotDePasseCompte(event.target.value)}
                minLength={6}
                required
              />
            </label>

            <div className="student-form-actions">
              <button type="submit" disabled={creationCompte}>
                {creationCompte ? 'Création en cours…' : 'Créer le compte'}
              </button>
              <button
                type="button"
                className="secondary-button"
                onClick={fermerCreationCompte}
                disabled={creationCompte}
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="content-card" id="formulaire-etudiant">
        <h2>
          {etudiantEnEdition
            ? `Modifier ${etudiantEnEdition.prenom} ${etudiantEnEdition.nom}`
            : 'Ajouter un étudiant'}
        </h2>

        <form onSubmit={enregistrerEtudiant} className="student-form">
          <label>
            Matricule
            <input
              value={formulaire.matricule}
              onChange={(event) =>
                setFormulaire({ ...formulaire, matricule: event.target.value })
              }
              placeholder="Ex. L2-003"
              required
            />
          </label>

          <label>
            Nom
            <input
              value={formulaire.nom}
              onChange={(event) =>
                setFormulaire({ ...formulaire, nom: event.target.value })
              }
              required
            />
          </label>

          <label>
            Prénom
            <input
              value={formulaire.prenom}
              onChange={(event) =>
                setFormulaire({ ...formulaire, prenom: event.target.value })
              }
              required
            />
          </label>

          <label>
            Adresse e-mail
            <input
              type="email"
              value={formulaire.email}
              onChange={(event) =>
                setFormulaire({ ...formulaire, email: event.target.value })
              }
              required
            />
          </label>

          <div className="student-form-actions">
            <button type="submit" disabled={envoi}>
              {envoi
                ? 'Enregistrement…'
                : etudiantEnEdition
                  ? 'Enregistrer les modifications'
                  : 'Ajouter l’étudiant'}
            </button>

            {etudiantEnEdition && (
              <button
                type="button"
                className="secondary-button"
                onClick={annulerModification}
                disabled={envoi}
              >
                Annuler
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="content-card">
        <div className="list-heading">
          <h2>Liste des étudiants</h2>
          <input
            value={recherche}
            onChange={(event) => setRecherche(event.target.value)}
            placeholder="Rechercher un étudiant…"
            aria-label="Rechercher un étudiant"
          />
        </div>

        {chargement ? (
          <p>Chargement des étudiants…</p>
        ) : resultat.length === 0 ? (
          <p>Aucun étudiant trouvé.</p>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Matricule</th>
                  <th>Nom</th>
                  <th>Prénom</th>
                  <th>E-mail</th>
                  <th>Détails</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {resultat.map((etudiant) => (
                  <tr key={etudiant.id}>
                    <td>{etudiant.matricule}</td>
                    <td>{etudiant.nom}</td>
                    <td>{etudiant.prenom}</td>
                    <td>{etudiant.email}</td>
                    <td>
                      <button
                        type="button"
                        onClick={() => setEtudiantSelectionne(etudiant)}
                      >
                        Voir
                      </button>
                    </td>
                    <td>
                      <div className="student-actions">
                        <button
                          type="button"
                          onClick={() => ouvrirCreationCompte(etudiant)}
                          disabled={envoi || suppressionId !== null || creationCompte}
                        >
                          Créer un compte
                        </button>

                        <button
                          type="button"
                          onClick={() => commencerModification(etudiant)}
                          disabled={envoi || suppressionId !== null}
                        >
                          Modifier
                        </button>

                        <button
                          type="button"
                          className="danger-button"
                          onClick={() => void supprimerEtudiant(etudiant)}
                          disabled={envoi || suppressionId !== null}
                        >
                          {suppressionId === etudiant.id
                            ? 'Suppression…'
                            : 'Supprimer'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {etudiantSelectionne && (
        <div className="content-card">
          <div className="list-heading">
            <h2>Détails de l’étudiant</h2>
            <button
              type="button"
              onClick={() => setEtudiantSelectionne(null)}
            >
              Fermer
            </button>
          </div>

          <p><strong>Matricule :</strong> {etudiantSelectionne.matricule}</p>
          <p><strong>Nom :</strong> {etudiantSelectionne.nom}</p>
          <p><strong>Prénom :</strong> {etudiantSelectionne.prenom}</p>
          <p><strong>E-mail :</strong> {etudiantSelectionne.email}</p>
          <p>
            <strong>Programme :</strong>{' '}
            {etudiantSelectionne.programme?.nom || 'Non renseigné'}
          </p>
        </div>
      )}
    </section>
  );
}
