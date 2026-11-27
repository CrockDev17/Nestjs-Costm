import { TypeOrmModuleOptions } from '@nestjs/typeorm';

const databaseUrl = process.env.DATABASE_URL;
const isProduction = process.env.NODE_ENV === 'production';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',

  ...(databaseUrl
    ? {
        url: databaseUrl,
        ssl: { rejectUnauthorized: false },
      }
    : {
        host: process.env.DB_HOST || 'localhost',
        port: Number(process.env.DB_PORT || 5432),
        username: process.env.DB_USERNAME || 'postgres',
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME || 'projet_costm',
      }),

  entities: [__dirname + '/../../**/*.entity{.ts,.js}'],
  synchronize: !isProduction,
};