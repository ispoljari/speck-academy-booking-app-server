const hallRepository = require("../../repositories/halls");
const { HTTP_STATUS_CODES } = require("../../enums");
const _ = require("lodash");
const err = require("../../enums/error-responses");

const getHalls = async (request, response, next) => {
  try {
    const halls = await hallRepository.getAll();
    response.status(HTTP_STATUS_CODES.OK).json(halls);
  } catch (error) {
    next(error);
  }
};

const getHallById = async (request, response, next) => {
  try {
    const id = parseInt(request.params.id);
    if (isNaN(id)) {
      next(err.idNan);
      return;
    }

    const hall = await hallRepository.getById(id);
    if (!hall) {
      next(err.hallDoesNotExist);
      return;
    }

    response.status(HTTP_STATUS_CODES.OK).json(hall);
  } catch (error) {
    next(error);
  }
};

const createHall = async (request, response, next) => {
  try {
    if (!request.isAdmin) {
      next(err.unauthorized);
      return;
    }

    const { name, address, pictureUrl, description } = request.body;
    const hall = await hallRepository.getHallByName(name);
    if (hall) {
      next(err.hallAlreadyExists);
      return;
    }
    await hallRepository.create(name, address, pictureUrl, description);
    response.status(HTTP_STATUS_CODES.CREATED).json({});
  } catch (error) {
    next(error);
  }
};

const updateHall = async (request, response, next) => {
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

    const hall = await hallRepository.getById(id);
    if (!hall) {
      next(err.hallDoesNotExist);
      return;
    }

    const { name, address, pictureUrl, description } = request.body;
    const hallWithUniqueName = await hallRepository.getHallByName(name);
    if (hallWithUniqueName) {
      next(err.hallAlreadyExists);
      return;
    }

    Object.assign(
      hall,
      _.omitBy(
        {
          name,
          address,
          pictureUrl,
          description
        },
        _.isUndefined
      )
    );

    await hallRepository.update(
      hall.name,
      hall.address,
      hall.pictureUrl,
      hall.description,
      id
    );
    response.status(HTTP_STATUS_CODES.OK).json({});
  } catch (error) {
    next(error);
  }
};

const deleteHall = async (request, response, next) => {
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

    const hall = await hallRepository.getById(id);
    if (!hall) {
      next(err.hallDoesNotExist);
      return;
    }

    await hallRepository.deleteById(id);
    response.status(HTTP_STATUS_CODES.OK).json({});
  } catch (error) {
    next(error);
  }
};

const getHallsWithReservationsByReservationDateRange = async (
  request,
  response,
  next
) => {
  try {
    if (!request.isAdmin) {
      next(err.unauthorized);
      return;
    }
    const { startDate, endDate } = request.query;
    if (startDate >= endDate) {
      next(err.startDateEndDate);
      return;
    }

    const hallsWithReservationsByReservationDateRange = await hallRepository.getAllWithReservationsByReservationDateRange(
      startDate,
      endDate
    );
    response
      .status(HTTP_STATUS_CODES.OK)
      .json(hallsWithReservationsByReservationDateRange);
  } catch (error) {
    next(error);
  }
};

const getHallByIdWithReservations = async (request, response, next) => {
  try {
    const id = parseInt(request.params.id);
    if (isNaN(id)) {
      next(err.idNan);
      return;
    }

    const hall = await hallRepository.getById(id);
    if (!hall) {
      next(err.hallDoesNotExist);
      return;
    }

    const { reservationDate } = request.query;
    const hallWithReservations = await hallRepository.getByIdWithReservations(
      id,
      reservationDate
    );
    response.status(HTTP_STATUS_CODES.OK).json(hallWithReservations);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getHalls,
  getHallById,
  createHall,
  updateHall,
  deleteHall,
  getHallsWithReservationsByReservationDateRange,
  getHallByIdWithReservations
};
