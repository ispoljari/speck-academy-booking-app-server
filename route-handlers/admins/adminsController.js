const db = require("../../db/connect");
const express = require("express");
const bcrypt = require("bcrypt");
const { HTTP_STATUS_CODES } = require("../../enums");

const adminLogin = async (request, response) => {
  const { userName, password } = request.body;

  const dbResponse = await db.query(
    "SELECT * FROM Admins WHERE user_name = $1",
    [userName]
  );
  if (dbResponse.rows.length === 0) {
    throw new Error("Invalid credentials");
  }
  const admin = dbResponse.rows[0];
  const { hashed_password: hashedPassword } = admin;

  if (!(await bcrypt.compare(password, hashedPassword))) {
    throw new Error("Invalid credentials");
  }
  // TODO: send token in response.Check if token has expired.
};

const router = new express.Router();

router.route("/login").post(adminLogin);

module.exports = router;
