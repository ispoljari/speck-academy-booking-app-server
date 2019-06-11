const RESERVATION_TYPES = require("./reservation_types");
const HTTP_STATUS_CODES = require("./http_status_codes");

const isValueValidEnum = (value, enumObject) =>
  Object.values(enumObject).includes(value);

module.exports = {
  RESERVATION_TYPES,
  HTTP_STATUS_CODES,
  isValueValidEnum
};
