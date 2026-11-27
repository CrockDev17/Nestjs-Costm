import { randomUUID } from 'node:crypto';
import { Pool } from 'pg';
import * as bcrypt from 'bcryptjs';

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: 'Crockb13123',
  database: 'projet_costm',
});

async function seedAdmin() {
  const client = await pool.connect();

  try {
    const email = 'admin@costm.mg';
    const password = 'Admin123!';

    const hashedPassword = await bcrypt.hash(password, 12);

    const existing = await client.query(
      'SELECT id, role FROM users WHERE email = $1',
      [email],
    );

    if (existing.rows.length > 0) {
      await client.query(
        'UPDATE users SET password = $1, role = $2 WHERE email = $3',
        [hashedPassword, 'ADMIN', email],
      );

      console.log('======================================');
      console.log('ADMIN EXISTANT MIS À JOUR');
      console.log('======================================');
    } else {
      const id = randomUUID();

      await client.query(
        `
        INSERT INTO users (
          id,
          email,
          password,
          role,
          etudiant_id
        )
        VALUES ($1, $2, $3, $4, $5)
        `,
        [
          id,
          email,
          hashedPassword,
          'ADMIN',
          null,
        ],
      );

      console.log('======================================');
      console.log('ADMIN CRÉÉ AVEC SUCCÈS');
      console.log('======================================');
    }

    console.log('');
    console.log('Email    : admin@costm.mg');
    console.log('Password : Admin123!');
    console.log('Role     : ADMIN');
    console.log('');
  } catch (error) {
    console.error('Erreur lors de la création de l’admin :');
    console.error(error);
    process.exitCode = 1;
  } finally {
    client.release();
    await pool.end();
  }
}

seedAdmin();