import dotenv from "dotenv";
import pg from "pg";

dotenv.config();

const Pool = pg.Pool;

const ENVIRONMENT = {
  LOCAL: "local",
  PRODUCTION: "production",
};

const dbConfigs = {
  [ENVIRONMENT.LOCAL]: {
    user: process.env.DB_USERNAME_LOCAL,
    host: process.env.DB_HOST_LOCAL,
    database: process.env.DB_DATABASE_LOCAL,
    password: process.env.DB_PASSWORD_LOCAL,
    port: process.env.DB_PORT_LOCAL,
  },
  [ENVIRONMENT.PRODUCTION]: {
    user: process.env.DB_USERNAME_PROD,
    host: process.env.DB_HOST_PROD,
    database: process.env.DB_DATABASE_PROD,
    password: process.env.DB_PASSWORD_PROD,
    port: process.env.DB_PORT_PROD,
  },
};

export const pool = new Pool(
  process.env.ENVIRONMENT === ENVIRONMENT.PRODUCTION
    ? dbConfigs[ENVIRONMENT.PRODUCTION]
    : dbConfigs[ENVIRONMENT.LOCAL]
);
