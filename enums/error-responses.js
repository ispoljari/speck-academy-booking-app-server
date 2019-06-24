const HTTP_STATUS_CODES = require("./http_status_codes");

const notFound = {
  status: HTTP_STATUS_CODES.NOT_FOUND,
  message: "Invalid URL"
};

const unauthorized = {
  status: HTTP_STATUS_CODES.UNAUTHORIZED,
  message: "Not authorized"
};

const idNan = {
  status: HTTP_STATUS_CODES.BAD_REQUEST,
  message: "id should be a number"
};

const hallDoesNotExist = {
  status: HTTP_STATUS_CODES.BAD_REQUEST,
  message: "Hall with that id does not exist"
};

const hallAlreadyExists = {
  status: HTTP_STATUS_CODES.BAD_REQUEST,
  message: "Hall with that name already exists"
};

const startDateEndDate = {
  status: HTTP_STATUS_CODES.BAD_REQUEST,
  message: "endDate cannot be less than startDate"
};

const adminInvalidCredentials = {
  status: HTTP_STATUS_CODES.BAD_REQUEST,
  message: "Invalid credentials"
};

const reservationDoesNotExist = {
  status: HTTP_STATUS_CODES.BAD_REQUEST,
  message: "Reservation with that id does not exist"
};

const reservationsOverlap = {
  status: HTTP_STATUS_CODES.BAD_REQUEST,
  message: "Reservation overlaps with existing reservations"
};

const wrongTimeFormat = {
  status: HTTP_STATUS_CODES.BAD_REQUEST,
  message: "Wrong time format"
};

const startTimeEndTime = {
  status: HTTP_STATUS_CODES.BAD_REQUEST,
  message: "reservationEndTime cannot be less than reservationStartTime"
};

const startTimeEndTimeRange = {
  status: HTTP_STATUS_CODES.BAD_REQUEST,
  message: "Hall must be reserved between 08:00h and 22:00h"
};

const hallFkNan = {
  status: HTTP_STATUS_CODES.BAD_REQUEST,
  message: "hallFk should be a number"
};

const hallFkDoesNotExist = {
  status: HTTP_STATUS_CODES.BAD_REQUEST,
  message: "You sent the wrong hallFk, hall with that id does not exist"
};

const NotValidReservationEnumValues = {
  status: HTTP_STATUS_CODES.BAD_REQUEST,
  message: "Invalid enum values"
};

const startDateTimeValidation = {
  status: HTTP_STATUS_CODES.BAD_REQUEST,
  message: "Reservation cannot be in the past"
};

const reservationNotNull = {
  status: HTTP_STATUS_CODES.BAD_REQUEST,
  message: "Reservation cannot contain a null value"
};

const hallNotNull = {
  status: HTTP_STATUS_CODES.BAD_REQUEST,
  message: "Hall cannot contain a null value"
};

module.exports = {
  idNan,
  hallDoesNotExist,
  unauthorized,
  hallAlreadyExists,
  startDateEndDate,
  notFound,
  adminInvalidCredentials,
  reservationDoesNotExist,
  reservationsOverlap,
  wrongTimeFormat,
  startTimeEndTime,
  startTimeEndTimeRange,
  hallFkNan,
  hallFkDoesNotExist,
  NotValidReservationEnumValues,
  startDateTimeValidation,
  reservationNotNull,
  hallNotNull
};
