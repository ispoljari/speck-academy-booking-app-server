const adminsRepository = require("../../repositories/admins");
const uuidv4 = require("uuid/v4");
const bcrypt = require("bcrypt");
const { DateTime } = require("luxon");
const sessionsRepository = require("../../repositories/sessions");
const { HTTP_STATUS_CODES } = require("../../enums");

const adminLogin = async (request, response) => {
  try {
    const { userName, password } = request.body;
    const admin = await adminsRepository.getByUserName(userName);
    if (!admin) {
      throw new Error("Invalid credentials");
    }
    if (!(await bcrypt.compare(password, admin.hashedPassword))) {
      throw new Error("Invalid credentials");
    }
    const uuid = uuidv4();
    const loginTimestamp = DateTime.local();
    const expiryDate = loginTimestamp.plus({ days: 1 });

    await sessionsRepository.create(
      uuid,
      admin.id,
      loginTimestamp.toISO(),
      expiryDate.toISO()
    );
    response.cookie("sessionId", uuid, {
      expires: expiryDate.toJSDate(),
      signed: true
    });
    response.status(HTTP_STATUS_CODES.OK).json({});
  } catch (error) {
    response.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      message: error.message
    });
  }
};

const adminLogout = async (request, response) => {
  try {
    const { sessionId } = request.signedCookies;
    await adminsRepository.updateLogoutTimestamp(sessionId);
    response.clearCookie("sessionId");
    response.status(HTTP_STATUS_CODES.OK).json({});
  } catch (error) {
    response.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      message: error.message
    });
  }
};

module.exports = {
  adminLogin,
  adminLogout
};
