const reservationRepository = require("../../repositories/reservations");
const hallRepository = require("../../repositories/halls");
const { DateTime } = require("luxon");
const {
  HTTP_STATUS_CODES,
  RESERVATION_TYPES,
  isValueValidEnum
} = require("../../enums");

const isTimeValid = time => {
  const dateTime = DateTime.fromFormat(time, "HH:mm");
  return dateTime.minute % 15 === 0;
};

const getReservations = async (request, response) => {
  try {
    if (!request.isAdmin) {
      response.status(HTTP_STATUS_CODES.UNAUTHORIZED).json({
        message: "Not authorized"
      });
      return;
    }
    const reservations = await reservationRepository.getAll();
    response.status(HTTP_STATUS_CODES.OK).json(reservations);
  } catch (error) {
    response.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      message: error.message
    });
  }
};

const getReservationById = async (request, response) => {
  try {
    if (!request.isAdmin) {
      response.status(HTTP_STATUS_CODES.UNAUTHORIZED).json({
        message: "Not authorized"
      });
      return;
    }
    const id = parseInt(request.params.id);
    if (isNaN(id)) {
      response.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
        message: "id should be a number"
      });
      return;
    }

    const reservation = await reservationRepository.getById(id);
    if (!reservation) {
      response.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
        message: "Reservation with that id does not exist"
      });
      return;
    }

    response.status(HTTP_STATUS_CODES.OK).json(reservation);
  } catch (error) {
    response.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      message: error.message
    });
  }
};

const createReservation = async (request, response) => {
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

    const overlappingReservations = await reservationRepository.getAllOverlappingReservations(
      reservationDate,
      reservationStartTime,
      reservationEndTime
    );
    if (overlappingReservations.length > 0) {
      response.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
        message: "Reservation overlaps with existing reservations"
      });
      return;
    }
    if (reservationStartTime >= reservationEndTime) {
      response.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
        message: "reservationEndTime cannot be less than reservationStartTime"
      });
      return;
    }

    if (
      !isTimeValid(reservationStartTime) ||
      !isTimeValid(reservationEndTime)
    ) {
      response.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
        message: "Wrong time format"
      });
      return;
    }

    const hallFk = parseInt(body.hallFk);
    if (isNaN(hallFk)) {
      response.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
        message: "hallFk should be a number"
      });
      return;
    }
    const hall = await hallRepository.getById(hallFk);
    if (!hall) {
      response.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
        message: "You sent the wrong hallFk, hall with that id does not exist"
      });
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
    response.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      message: error.message
    });
  }
};

const updateReservationStatus = async (request, response, next) => {
  try {
    if (!request.isAdmin) {
      response.status(HTTP_STATUS_CODES.UNAUTHORIZED).json({
        message: "Not authorized"
      });
      return;
    }

    const { body, params } = request;
    const id = parseInt(params.id);
    if (isNaN(id)) {
      response.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
        message: "id should be a number"
      });
      return;
    }

    const reservation = await reservationRepository.getById(id);
    if (!reservation) {
      response.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
        message: "Reservation with that id does not exist"
      });
      return;
    }

    const reservationStatus = body.reservationStatus;
    if (!isValueValidEnum(reservationStatus, RESERVATION_TYPES)) {
      response.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
        message: "Invalid enum values"
      });
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
    response.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      message: error.message
    });
  }
};

const deleteReservation = async (request, response, next) => {
  try {
    if (!request.isAdmin) {
      response.status(HTTP_STATUS_CODES.UNAUTHORIZED).json({
        message: "Not authorized"
      });
      return;
    }
    const id = parseInt(request.params.id);
    if (isNaN(id)) {
      response.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
        message: "id should be a number"
      });
      return;
    }

    const reservation = await reservationRepository.getById(id);
    if (!reservation) {
      response.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
        message: "Reservation with that id does not exist"
      });
      return;
    }
    await reservationRepository.deleteById(id);
    response.status(HTTP_STATUS_CODES.OK).json({});
  } catch (error) {
    response.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      message: error.message
    });
  }
};

const getReservationsByReservationStatus = async (request, response) => {
  try {
    if (!request.isAdmin) {
      response.status(HTTP_STATUS_CODES.UNAUTHORIZED).json({
        message: "Not authorized"
      });
      return;
    }
    const reservations = await reservationRepository.getAllByReservationStatus();
    response.status(HTTP_STATUS_CODES.OK).json(reservations);
  } catch (error) {
    response.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      message: error.message
    });
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
