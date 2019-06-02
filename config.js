const PORT = process.env.PORT || 8080;

const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || "http://localhost:3000";

const HTTP_STATUS_CODES = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500
};

const DB_CONNECTION = {
  user: process.env.DB_USER || "postgres",
  host: process.env.DB_HOST || "localhost",
  password: process.env.DB_PASSWORD || "123456",
  database: process.env.DB_NAME || "postgres",
  port: process.env.DB_PORT || "5432"
};

module.exports = {
  PORT,
  HTTP_STATUS_CODES,
  CLIENT_ORIGIN,
  DB_CONNECTION
};
