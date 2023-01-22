import * as dotenv from "dotenv";

dotenv.config();

export const {
  NODE_ENV,
  PORT,
  DB_HOST,
  DB_PORT,
  DB_USER,
  DB_PASSWORD,
  DB_DATABASE,
  SECRET_KEY,
  ENCRYPTION_KEY,
  MQ_URL,
  MQ_PORT,
  MQ_USER,
  MQ_PASSWORD,
} = process.env;
