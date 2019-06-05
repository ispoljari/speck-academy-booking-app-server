const db = require("../db/connect");
const { mapAdmins } = require("./utils");

const getByUserName = async userName => {
  const dbResponse = await db.query(
    "SELECT * FROM Admins WHERE user_name = $1",
    [userName]
  );
  return dbResponse.rows.length > 0 ? mapAdmins(dbResponse.rows[0]) : null;
};

module.exports = {
  getByUserName
};
