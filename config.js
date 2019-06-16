const PORT = process.env.PORT || 8080;

const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || "http://localhost:3000";
const COOKIE_SECRET_KEY = process.env.COOKIE_SECRET_KEY;

const DB_CONNECTION = {
  user: process.env.DB_USER || "postgres",
  host: process.env.DB_HOST || "localhost",
  password: process.env.DB_PASSWORD || "123456",
  database: process.env.DB_NAME || "postgres",
  port: process.env.DB_PORT || "5432"
};

module.exports = {
  PORT,
  CLIENT_ORIGIN,
  DB_CONNECTION,
  COOKIE_SECRET_KEY
};
