const reservationRepository = require("../../repositories/reservations");
const hallRepository = require("../../repositories/halls");
const { DateTime } = require("luxon");
const {
  HTTP_STATUS_CODES,
  RESERVATION_TYPES,
  isValueValidEnum
} = require("../../enums");

const err = require("../../enums/error-responses");

const isTimeValid = time => {
  const dateTime = DateTime.fromFormat(time, "HH:mm");
  return dateTime.minute % 15 === 0;
};

const getReservations = async (request, response, next) => {
  try {
    if (!request.isAdmin) {
      next(err.unauthorized);
      return;
    }
    const reservations = await reservationRepository.getAll();
    response.status(HTTP_STATUS_CODES.OK).json(reservations);
  } catch (error) {
    next(error);
  }
};

const getReservationById = async (request, response, next) => {
  try {
    if (!request.isAdmin) {
      next(err.unauthorized);
      return;
    }
    const id = parseInt(request.params.id);
    if (isNaN(id)) {
      next(err.idNan);
      return;
    }

    const reservation = await reservationRepository.getById(id);
    if (!reservation) {
      next(err.reservationDoesNotExist);
      return;
    }

    response.status(HTTP_STATUS_CODES.OK).json(reservation);
  } catch (error) {
    next(error);
  }
};

const createReservation = async (request, response, next) => {
  try {
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

    if (
      !(
        reservationTitle &&
        reservationDescription &&
        reservationDate &&
        reservationStartTime &&
        reservationEndTime &&
        citizenFullName &&
        citizenEmail &&
        citizenPhoneNumber
      )
    ) {
      next(err.reservationNotNull);
      return;
    }

    const hallFk = parseInt(body.hallFk);
    if (isNaN(hallFk)) {
      next(err.hallFkNan);
      return;
    }
    const hall = await hallRepository.getById(hallFk);
    if (!hall) {
      next(err.hallFkDoesNotExist);
      return;
    }

    const startDateTime = DateTime.fromFormat(
      `${reservationDate} ${reservationStartTime}`,
      "yyyy-MM-dd HH:mm",
      { zone: "Europe/Zagreb" }
    );
    if (startDateTime < DateTime.local()) {
      next(err.startDateTimeValidation);
      return;
    }

    const overlappingReservations = await reservationRepository.getAllOverlappingReservations(
      reservationDate,
      reservationStartTime,
      reservationEndTime,
      hallFk
    );

    if (overlappingReservations.length > 0) {
      next(err.reservationsOverlap);
      return;
    }

    if (
      !isTimeValid(reservationStartTime) ||
      !isTimeValid(reservationEndTime)
    ) {
      next(err.wrongTimeFormat);
      return;
    }

    if (reservationStartTime >= reservationEndTime) {
      next(err.startTimeEndTime);
      return;
    }

    if (reservationStartTime < "08:00" || reservationEndTime > "22:00") {
      next(err.startTimeEndTimeRange);
      return;
    }

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
  } catch (error) {
    next(error);
  }
};

const updateReservationStatus = async (request, response, next) => {
  try {
    if (!request.isAdmin) {
      next(err.unauthorized);
      return;
    }

    const { body, params } = request;
    const id = parseInt(params.id);
    if (isNaN(id)) {
      next(err.idNan);
      return;
    }

    const reservation = await reservationRepository.getById(id);
    if (!reservation) {
      next(err.reservationDoesNotExist);
      return;
    }

    const reservationStatus = body.reservationStatus;
    if (!isValueValidEnum(reservationStatus, RESERVATION_TYPES)) {
      next(err.NotValidReservationEnumValues);
      return;
    }

    if (reservationStatus === RESERVATION_TYPES.DENIED) {
      await reservationRepository.deleteById(id);
      response.status(HTTP_STATUS_CODES.OK).json({});
    } else {
      await reservationRepository.update(reservationStatus, id);
      response.status(HTTP_STATUS_CODES.OK).json({});
    }
  } catch (error) {
    next(error);
  }
};

const deleteReservation = async (request, response, next) => {
  try {
    if (!request.isAdmin) {
      next(err.unauthorized);
      return;
    }
    const id = parseInt(request.params.id);
    if (isNaN(id)) {
      next(err.idNan);
      return;
    }

    const reservation = await reservationRepository.getById(id);
    if (!reservation) {
      next(err.reservationDoesNotExist);
      return;
    }
    await reservationRepository.deleteById(id);
    response.status(HTTP_STATUS_CODES.OK).json({});
  } catch (error) {
    next(error);
  }
};

const getReservationsByReservationStatus = async (request, response, next) => {
  try {
    if (!request.isAdmin) {
      next(err.unauthorized);
      return;
    }
    const reservations = await reservationRepository.getAllByReservationStatus();
    response.status(HTTP_STATUS_CODES.OK).json(reservations);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getReservations,
  getReservationById,
  createReservation,
  updateReservationStatus,
  deleteReservation,
  getReservationsByReservationStatus
};
