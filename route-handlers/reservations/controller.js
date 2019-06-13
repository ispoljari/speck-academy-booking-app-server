const reservationRepository = require("../../repositories/reservations");
const { DateTime } = require("luxon");
const {
  HTTP_STATUS_CODES,
  RESERVATION_TYPES,
  isValueValidEnum
} = require("../../enums");

const getReservations = async (request, response) => {
  const reservations = await reservationRepository.getAll();
  response.status(HTTP_STATUS_CODES.OK).json(reservations);
};

const getReservationById = async (request, response, next) => {
  if (!request.isAdmin) {
    throw new Error("Unauthorized");
  }
  const id = parseInt(request.params.id);
  if (isNaN(id)) {
    next({
      status: HTTP_STATUS_CODES.BAD_REQUEST,
      message: "id should be a number"
    });
    return;
  }
  const reservation = await reservationRepository.getById(id);
  if (!reservation) {
    next({
      status: HTTP_STATUS_CODES.BAD_REQUEST,
      message: "Reservation with that id does not exist"
    });
    return;
  }
  response.status(HTTP_STATUS_CODES.OK).json(reservation);
};

const createReservation = async (request, response) => {
  const { body } = request;
  const {
    reservationTitle,
    reservationDescription,
    reservationDate,
    reservationStartTime,
    reservationEndTime,
    citizenFullName,
    citizenOrganization,
    citizenEmail,
    citizenPhoneNumber
  } = body;
  if (reservationStartTime >= reservationEndTime) {
    throw new Error("reservationStartTime cannot be after reservationEndTime");
  }
  const hallFk = parseInt(body.hallFk);
  const reservationStatus = RESERVATION_TYPES.PENDING;

  await reservationRepository.create(
    hallFk,
    reservationTitle,
    reservationDescription,
    reservationStatus,
    reservationDate,
    reservationStartTime,
    reservationEndTime,
    citizenFullName,
    citizenOrganization,
    citizenEmail,
    citizenPhoneNumber
  );
  response.status(HTTP_STATUS_CODES.CREATED).json({});
};

const updateReservationStatus = async (request, response, next) => {
  if (!request.isAdmin) {
    throw new Error("Unauthorized");
  }

  const { body, params } = request;
  const id = parseInt(params.id);
  const reservation = await reservationRepository.getById(id);
  if (!reservation) {
    next({
      status: HTTP_STATUS_CODES.BAD_REQUEST,
      message: "Reservation with that id does not exist"
    });
    return;
  }

  const reservationStatus = body.reservationStatus;
  if (!isValueValidEnum(reservationStatus, RESERVATION_TYPES)) {
    next({
      status: HTTP_STATUS_CODES.BAD_REQUEST,
      message: "Invalid enum value"
    });
    return;
  }

  /* if (reservationStatus === RESERVATION_TYPES.DENIED) {
    await reservationRepository.deleteById(id);
  response.status(HTTP_STATUS_CODES.OK).json({});
  } else {
    await reservationRepository.update(reservationStatus, id);
  response.status(HTTP_STATUS_CODES.OK).json({});
  } */

  await reservationRepository.update(reservationStatus, id);
  response.status(HTTP_STATUS_CODES.OK).json({});
};

const deleteReservation = async (request, response, next) => {
  if (!request.isAdmin) {
    throw new Error("Unauthorized");
  }
  const id = parseInt(request.params.id);
  const reservation = await reservationRepository.getById(id);
  if (!reservation) {
    next({
      status: HTTP_STATUS_CODES.BAD_REQUEST,
      message: "Reservation with that id does not exist"
    });
    return;
  }
  await reservationRepository.deleteById(id);
  response.status(HTTP_STATUS_CODES.OK).json({});
};

const getReservationsByReservationStatus = async (request, response) => {
  if (!request.isAdmin) {
    throw new Error("Unauthorized");
  }
  const reservations = await reservationRepository.getAllByReservationStatus();
  response.status(HTTP_STATUS_CODES.OK).json(reservations);
};

module.exports = {
  getReservations,
  getReservationById,
  createReservation,
  updateReservationStatus,
  deleteReservation,
  getReservationsByReservationStatus
};