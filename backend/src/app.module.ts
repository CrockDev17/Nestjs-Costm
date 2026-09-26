import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './core/config/typeorm.config';
import { EtudiantModule } from './modules/etudiant/etudiant.module';
import { PresenceModule } from './modules/presence/presence.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    EtudiantModule,
    PresenceModule,
  ],
})
export class AppModule {}