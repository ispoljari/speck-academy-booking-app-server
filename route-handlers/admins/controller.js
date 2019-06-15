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
      response.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
        message: "Invalid credentials"
      });
      return;
    }
    if (!(await bcrypt.compare(password, admin.hashedPassword))) {
      response.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
        message: "Invalid credentials"
      });
      return;
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
    if (!request.isAdmin) {
      response.status(HTTP_STATUS_CODES.UNAUTHORIZED).json({
        message: "Not authorized"
      });
      return;
    }
    const { sessionId } = request.signedCookies;
    await sessionsRepository.deleteById(sessionId);
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
