import { LoginUseCase } from '../../application/auth/LoginUseCase';
import { ListEtudiantsUseCase } from '../../application/etudiants/ListEtudiantsUseCase';
import { ListProgrammesUseCase } from '../../application/programmes/ListProgrammesUseCase';

import { HttpAuthRepository } from '../../infrastructure/repositories/HttpAuthRepository';
import { HttpEtudiantRepository } from '../../infrastructure/repositories/HttpEtudiantRepository';
import { HttpProgrammeRepository } from '../../infrastructure/repositories/HttpProgrammeRepository';
import { HttpDiplomeRepository } from '../../infrastructure/repositories/HttpDiplomeRepository';

import { ListNotesUseCase } from '../../application/notes/ListNotesUseCase';
import { CreateNoteUseCase } from '../../application/notes/CreateNoteUseCase';
import { HttpNoteRepository } from '../../infrastructure/repositories/HttpNoteRepository';

import { ListPresencesUseCase } from '../../application/presences/ListPresencesUseCase';
import { CreatePresenceUseCase } from '../../application/presences/CreatePresenceUseCase';
import { UpdatePresenceUseCase } from '../../application/presences/UpdatePresenceUseCase';
import { DeletePresenceUseCase } from '../../application/presences/DeletePresenceUseCase';
import { HttpPresenceRepository } from '../../infrastructure/repositories/HttpPresenceRepository';

import { ListPaiementsUseCase } from '../../application/paiements/ListPaiementsUseCase';
import { CreatePaiementUseCase } from '../../application/paiements/CreatePaiementUseCase';
import { HttpPaiementRepository } from '../../infrastructure/repositories/HttpPaiementRepository';

import { UpdateNoteUseCase } from '../../application/notes/UpdateNoteUseCase';
import { DeleteNoteUseCase } from '../../application/notes/DeleteNoteUseCase';
import { ListAnnoncesUseCase } from '../../application/annonces/ListAnnoncesUseCase';
import { CreateAnnonceUseCase } from '../../application/annonces/CreateAnnonceUseCase';
import { UpdateAnnonceUseCase } from '../../application/annonces/UpdateAnnonceUseCase';
import { DeleteAnnonceUseCase } from '../../application/annonces/DeleteAnnonceUseCase';
import { HttpAnnonceRepository } from '../../infrastructure/repositories/HttpAnnonceRepository';

export const authRepository = new HttpAuthRepository();
export const etudiantRepository = new HttpEtudiantRepository();
export const programmeRepository = new HttpProgrammeRepository();
export const diplomeRepository = new HttpDiplomeRepository();

export const loginUseCase = new LoginUseCase(authRepository);
export const listEtudiantsUseCase = new ListEtudiantsUseCase(etudiantRepository);
export const listProgrammesUseCase = new ListProgrammesUseCase(programmeRepository);

export const noteRepository = new HttpNoteRepository();
export const listNotesUseCase = new ListNotesUseCase(noteRepository);
export const createNoteUseCase = new CreateNoteUseCase(noteRepository);
export const updateNoteUseCase = new UpdateNoteUseCase(noteRepository);
export const deleteNoteUseCase = new DeleteNoteUseCase(noteRepository);

export const presenceRepository = new HttpPresenceRepository();
export const listPresencesUseCase = new ListPresencesUseCase(presenceRepository);
export const createPresenceUseCase = new CreatePresenceUseCase(presenceRepository);
export const updatePresenceUseCase = new UpdatePresenceUseCase(presenceRepository);
export const deletePresenceUseCase = new DeletePresenceUseCase(presenceRepository);

// import session de présence
import { HttpPresenceSessionRepository } from '../../infrastructure/repositories/HttpPresenceSessionRepository';
import { CreatePresenceSessionUseCase } from '../../application/presences/CreatePresenceSessionUseCase';
import { ListPresenceSessionsUseCase } from '../../application/presences/ListPresenceSessionsUseCase';
import { ClosePresenceSessionUseCase } from '../../application/presences/ClosePresenceSessionUseCase';
import { ScanPresenceSessionUseCase } from '../../application/presences/ScanPresenceSessionUseCase';

export const paiementRepository = new HttpPaiementRepository();
export const listPaiementsUseCase = new ListPaiementsUseCase(paiementRepository);
export const createPaiementUseCase = new CreatePaiementUseCase(paiementRepository);
export const annonceRepository = new HttpAnnonceRepository();
export const listAnnoncesUseCase = new ListAnnoncesUseCase(annonceRepository);
export const createAnnonceUseCase = new CreateAnnonceUseCase(annonceRepository);
export const updateAnnonceUseCase = new UpdateAnnonceUseCase(annonceRepository);
export const deleteAnnonceUseCase = new DeleteAnnonceUseCase(annonceRepository);

//export session de présence
export const presenceSessionRepository = new HttpPresenceSessionRepository();

export const createPresenceSessionUseCase =
    new CreatePresenceSessionUseCase(presenceSessionRepository);

export const listPresenceSessionsUseCase =
    new ListPresenceSessionsUseCase(presenceSessionRepository);

export const closePresenceSessionUseCase =
    new ClosePresenceSessionUseCase(presenceSessionRepository);

export const scanPresenceSessionUseCase =
    new ScanPresenceSessionUseCase(presenceSessionRepository);