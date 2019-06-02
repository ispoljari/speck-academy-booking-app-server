const db = require("../../db/connect");
const express = require("express");
const HTTP_STATUS_CODES = require("../../enums/http_status_codes");
const _ = require("lodash");

const getHalls = async (request, response) => {
  const dbResponse = await db.query("SELECT * FROM Halls ORDER BY id ASC");
  response.status(HTTP_STATUS_CODES.OK).json(dbResponse.rows);
};

const getHallById = async (request, response) => {
  const id = parseInt(request.params.id);
  const dbResponse = await db.query("SELECT * FROM Halls WHERE id = $1", [id]);
  response.status(HTTP_STATUS_CODES.OK).json(dbResponse.rows[0]);
};

const createHall = async (request, response) => {
  const { name, address, pictureUrl, description } = request.body;
  await db.query(
    `INSERT INTO Halls (name, address, picture_url, description) 
  VALUES ($1, $2, $3, $4)`,
    [name, address, pictureUrl, description]
  );
  response.status(HTTP_STATUS_CODES.CREATED).json({});
};

const updateHall = async (request, response) => {
  const id = parseInt(request.params.id);
  const dbResponse = await db.query("SELECT * FROM Halls WHERE id = $1", [id]);
  const hall = dbResponse.rows[0];
  if (!hall) {
    throw new Error("Hall does not exist");
  }

  const { name, address, pictureUrl, description } = request.body;
  // TODO: upload picture
  Object.assign(
    hall,
    _.omitBy(
      {
        name,
        address,
        picture_url: pictureUrl,
        description
      },
      _.isUndefined
    )
  );

  const updatedAt = new Date();

  await db.query(
    "UPDATE Halls SET name = $1, address = $2, picture_url = $3, description = $4, updated_at = $5 WHERE id = $6",
    [hall.name, hall.address, hall.picture_url, hall.description, updatedAt, id]
  );
  response.status(HTTP_STATUS_CODES.OK).json({});
};

const deleteHall = async (request, response) => {
  const id = parseInt(request.params.id);
  await db.query("DELETE FROM Halls WHERE id = $1", [id]);
  response.status(HTTP_STATUS_CODES.OK).json({});
};

const getHallsWithReservationsByReservationDateRange = async (
  request,
  response
) => {
  const { startDate, endDate } = request.body;
  const dbResponse = await db.query(
    `
    SELECT Halls.*, json_agg(reservations.*) as hall_reservations
    FROM Halls JOIN reservations ON Halls.id = hall_fk
    WHERE reservation_date BETWEEN $1 AND $2
    GROUP BY Halls.id`,
    [startDate, endDate]
  );
  response.status(HTTP_STATUS_CODES.OK).json(dbResponse.rows);
};

const router = new express.Router();

router.route("/").get(getHalls);
router.route("/create").post(createHall);
router
  .route("/reservations")
  .get(getHallsWithReservationsByReservationDateRange);
router.route("/:id").get(getHallById);
router.route("/update/:id").put(updateHall);
router.route("/delete/:id").delete(deleteHall);

module.exports = router;
