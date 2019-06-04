const db = require("../db/connect");

const map = dbAdmin => ({
  id: dbAdmin.id,
  userName: dbAdmin.user_name,
  hashedPassword: dbAdmin.hashed_password,
  createdAt: dbAdmin.created_at,
  updatedAt: dbAdmin.updated_at
});

const getByUserName = async userName => {
  const dbResponse = await db.query(
    "SELECT * FROM Admins WHERE user_name = $1",
    [userName]
  );
  return dbResponse.rows.length > 0 ? map(dbResponse.rows[0]) : null;
};

module.exports = {
  getByUserName
};
