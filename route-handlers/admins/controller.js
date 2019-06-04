const adminsRepository = require("../../repositories/admins");
const bcrypt = require("bcrypt");
const { HTTP_STATUS_CODES } = require("../../enums");

const adminLogin = async (request, response) => {
  const { userName, password } = request.body;

  const admin = await adminsRepository.getByUserName(userName);
  if (!admin) {
    throw new Error("Invalid credentials");
  }
  if (!(await bcrypt.compare(password, hashedPassword))) {
    throw new Error("Invalid credentials");
  }
  // TODO: send token in response.Check if token has expired.
};

module.exports = {
  adminLogin
};
