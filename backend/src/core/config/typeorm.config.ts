import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'Crockb13123', // Ajuste selon ton mot de passe PostgreSQL
  database: 'projet_costm',
  entities: [__dirname + '/../../**/*.entity{.ts,.js}'],
  synchronize: true, // Désactiver en production
};