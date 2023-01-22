import { DB_DATABASE, DB_HOST, DB_PASSWORD, DB_PORT, DB_USER } from './const.config';
import { join } from 'path';
import { DataSourceOptions } from 'typeorm';

export const dbConnection: DataSourceOptions = {
  type: 'mysql',
  host: DB_HOST,
  port: Number(DB_PORT),
  username: DB_USER,
  password: DB_PASSWORD,
  database: DB_DATABASE,
  synchronize: false,
  migrationsRun: false,
  entities: [join(__dirname, '../**/*.entity{.ts,.js}')],
  migrations: [join(__dirname, '../migrations/*{.ts,.js}')],
  subscribers: [join(__dirname, '../**/*.subscriber{.ts,.js}')],
  logger: "simple-console",
  logging: ["query", "error"]
};
