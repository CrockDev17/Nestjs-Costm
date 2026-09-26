"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.typeOrmConfig = void 0;
exports.typeOrmConfig = {
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'Crockb13123',
    database: 'projet_costm',
    entities: [__dirname + '/../../**/*.entity{.ts,.js}'],
    synchronize: true,
};
//# sourceMappingURL=typeorm.config.js.map