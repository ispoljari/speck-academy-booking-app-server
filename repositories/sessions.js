const db = require("../db/connect");

const create = async (uuid, adminFk, loginTimestamp, expiryDate) => {
  await db.query(
    `INSERT INTO Sessions (id, admin_fk, login_timestamp, expiry_date) 
    VALUES ($1, $2, $3, $4)`,
    [uuid, adminFk, loginTimestamp, expiryDate]
  );
};

module.exports = {
  create
};
