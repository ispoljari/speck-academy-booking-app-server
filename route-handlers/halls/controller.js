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
    const hall = await hallRepository.getHallByName(name);
    if (hall) {
      response.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
        message: "Hall with that name already exists"
      });
      return;
    }
    await hallRepository.create(name, address, pictureUrl, description);
    response.status(HTTP_STATUS_CODES.CREATED).json({});
  } catch (error) {
    response.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      message: error.message
    });
  }
};

const updateHall = async (request, response) => {
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

    const hall = await hallRepository.getById(id);
    if (!hall) {
      response.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
        message: "Hall with that id does not exist"
      });
      return;
    }

    const { name, address, pictureUrl, description } = request.body;
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
    response.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      message: error.message
    });
  }
};

const deleteHall = async (request, response) => {
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

    const hall = await hallRepository.getById(id);
    if (!hall) {
      response.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
        message: "Hall with that id does not exist"
      });
      return;
    }

    await hallRepository.deleteById(id);
    response.status(HTTP_STATUS_CODES.OK).json({});
  } catch (error) {
    response.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      message: error.message
    });
  }
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
      response.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
        message: "endDate cannot be less than startDate"
      });
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
    response.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      message: error.message
    });
  }
};

const getHallByIdWithReservations = async (request, response) => {
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

    const { reservationDate } = request.body;
    const hallWithReservations = await hallRepository.getByIdWithReservations(
      id,
      reservationDate
    );
    response.status(HTTP_STATUS_CODES.OK).json(hallWithReservations);
  } catch (error) {
    response.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      message: error.message
    });
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
