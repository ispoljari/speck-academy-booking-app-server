const db = require("../db/connect");
const { mapSessions } = require("./utils");

const create = async (uuid, adminFk, loginTimestamp, expiryDate) => {
  await db.query(
    `INSERT INTO Sessions (id, admin_fk, login_timestamp, expiry_date) 
    VALUES ($1, $2, $3, $4)`,
    [uuid, adminFk, loginTimestamp, expiryDate]
  );
};

const getById = async sessionId => {
  const dbResponse = await db.query("SELECT * FROM Sessions WHERE id = $1 ", [
    sessionId
  ]);
  return dbResponse.rows.length > 0 ? mapSessions(dbResponse.rows[0]) : null;
};

const updateLogoutTimestamp = async sessionId => {
  const currentDate = new Date();
  const logoutTimestamp = currentDate;
  const updatedAt = currentDate;
  await db.query(
    "UPDATE Sessions SET  logout_timestamp = $1, updated_at = $2 WHERE id = $3",
    [logoutTimestamp, updatedAt, sessionId]
  );
};

module.exports = {
  create,
  getById,
  updateLogoutTimestamp
};
