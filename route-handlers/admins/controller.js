const adminsRepository = require("../../repositories/admins");
const uuidv4 = require("uuid/v4");
const bcrypt = require("bcrypt");
const { DateTime } = require("luxon");
const sessionsRepository = require("../../repositories/sessions");
const { HTTP_STATUS_CODES } = require("../../enums");
const {
  adminInvalidCredentials,
  unauthorized
} = require("../../enums/error-responses");

const adminLogin = async (request, response, next) => {
  try {
    const { userName, password } = request.body;
    const admin = await adminsRepository.getByUserName(userName);
    if (!admin) {
      next(adminInvalidCredentials);
      return;
    }
    if (!(await bcrypt.compare(password, admin.hashedPassword))) {
      next(adminInvalidCredentials);
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
    next(error);
  }
};

const adminLogout = async (request, response, next) => {
  try {
    if (!request.isAdmin) {
      next(unauthorized);
      return;
    }
    const { sessionId } = request.signedCookies;
    await sessionsRepository.deleteById(sessionId);
    response.clearCookie("sessionId");
    response.status(HTTP_STATUS_CODES.OK).json({});
  } catch (error) {
    next(error);
  }
};

module.exports = {
  adminLogin,
  adminLogout
};
