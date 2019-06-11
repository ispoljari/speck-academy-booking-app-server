const hallRepository = require("../../repositories/halls");
const { HTTP_STATUS_CODES } = require("../../enums");
const _ = require("lodash");

const getHalls = async (request, response) => {
  try {
    const halls = await hallRepository.getAll();
    response.status(HTTP_STATUS_CODES.OK).json(halls);
  } catch (error) {
    response.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      message: error.message
    });
  }
};

const getHallById = async (request, response) => {
  try {
    const id = parseInt(request.params.id);
    if (isNaN(id)) {
      response.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
        message: "id should be a number"
      });
      return;
    }
    const hall = await hallRepository.getById(id);
    if (!hall) {
      response.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
        message: "Hall with that id does not exist"
      });
      return;
    }
    response.status(HTTP_STATUS_CODES.OK).json(hall);
  } catch (error) {
    response.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      message: error.message
    });
  }
};

const createHall = async (request, response) => {
  try {
    if (!request.isAdmin) {
      response.status(HTTP_STATUS_CODES.UNAUTHORIZED).json({
        message: "Not authorized"
      });
      return;
    }
    const { name, address, pictureUrl, description } = request.body;
    await hallRepository.create(name, address, pictureUrl, description);
    response.status(HTTP_STATUS_CODES.CREATED).json({});
  } catch (error) {
    response.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      message: error.message
    });
  }
};

const updateHall = async (request, response, next) => {
  if (!request.isAdmin) {
    throw new Error("Unauthorized");
  }
  const id = parseInt(request.params.id);
  const hall = await hallRepository.getById(id);
  if (!hall) {
    next({
      status: HTTP_STATUS_CODES.BAD_REQUEST,
      message: "Hall with that id does not exist"
    });
    return;
  }

  const { name, address, pictureUrl, description } = request.body;
  // TODO: upload picture
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
};

const deleteHall = async (request, response, next) => {
  if (!request.isAdmin) {
    throw new Error("Unauthorized");
  }
  const id = parseInt(request.params.id);
  const hall = await hallRepository.getById(id);
  if (!hall) {
    next({
      status: HTTP_STATUS_CODES.BAD_REQUEST,
      message: "Hall with that id does not exist"
    });
    return;
  }

  await hallRepository.deleteById(id);
  response.status(HTTP_STATUS_CODES.OK).json({});
};

const getHallsWithReservationsByReservationDateRange = async (
  request,
  response
) => {
  try {
    if (!request.isAdmin) {
      response.status(HTTP_STATUS_CODES.UNAUTHORIZED).json({
        message: "Not authorized"
      });
      return;
    }
    const { startDate, endDate } = request.body;
    if (startDate >= endDate) {
      throw new Error("startDate cannot be after endDate");
    }
    const hallsWithReservationsByReservationDateRange = await hallRepository.getAllWithReservationsByReservationDateRange(
      startDate,
      endDate
    );
    response
      .status(HTTP_STATUS_CODES.OK)
      .json(hallsWithReservationsByReservationDateRange);
  } catch (error) {
    response.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      message: error.message
    });
  }
};

const getHallByIdWithReservations = async (request, response, next) => {
  const id = parseInt(request.params.id);
  const hall = await hallRepository.getById(id);
  if (!hall) {
    next({
      status: HTTP_STATUS_CODES.BAD_REQUEST,
      message: "Hall with that id does not exist"
    });
    return;
  }
  const { reservationDate } = request.body;
  const hallWithReservations = await hallRepository.getByIdWithReservations(
    id,
    reservationDate
  );
  response.status(HTTP_STATUS_CODES.OK).json(hallWithReservations);
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
