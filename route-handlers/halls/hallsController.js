const db = require("../../db/connect");
const express = require("express");
const { HTTP_STATUS_CODES } = require("../../config");

const getHalls = (request, response) => {
  db.query("SELECT * FROM Halls ORDER BY id ASC")
    .then(res => response.status(HTTP_STATUS_CODES.OK).json(res.rows))
    .catch(error => {
      throw error;
    });
};

const getHallById = (request, response) => {
  const id = parseInt(request.params.id);
  db.query("SELECT * FROM Halls WHERE id = $1", [id])
    .then(res => response.status(HTTP_STATUS_CODES.OK).json(res.rows[0]))
    .catch(error => {
      throw error;
    });
};

const createHall = (request, response) => {
  const { name, address, pictureUrl, description } = request.body;

  db.query(
    "INSERT INTO Halls (name, address, picture_url, description) VALUES ($1, $2, $3, $4)",
    [name, address, pictureUrl, description]
  )
    .then(res => response.status(HTTP_STATUS_CODES.CREATED).json({}))
    .catch(error => {
      throw error;
    });
};

const updateHall = (request, response) => {
  const id = parseInt(request.params.id);
  const { name, address, pictureUrl, description } = request.body;
  const updatedAt = new Date();

  db.query(
    "UPDATE Halls SET name = $1, address = $2, picture_url = $3, description = $4, updated_at = $5 WHERE id = $6",
    [name, address, pictureUrl, description, updatedAt, id]
  )
    .then(res => response.status(HTTP_STATUS_CODES.OK).json({}))
    .catch(error => {
      throw error;
    });
};

const deleteHall = (request, response) => {
  const id = parseInt(request.params.id);

  db.query("DELETE FROM Halls WHERE id = $1", [id])
    .then(() => response.status(HTTP_STATUS_CODES.OK).json({}))
    .catch(error => {
      throw error;
    });
};

const getHallsWithReservationsByReservationDateRange = (request, response) => {
  const { startDate, endDate } = request.body;
  db.query(
    `SELECT Halls.*, array_agg(reservations.*) as hall_reservations
        FROM Halls JOIN reservations ON Halls.id = hall_fk
        WHERE date BETWEEN $1 AND $2
        GROUP BY Halls.id`,
    [startDate, endDate]
  )
    .then(res => response.status(HTTP_STATUS_CODES.OK).json(res.rows))
    .catch(error => {
      throw error;
    });
};

const router = new express.Router();

router.route("/").get(getHalls);
router.route("/:id").get(getHallById);
router.route("/create").post(createHall);
router.route("/update/:id").put(updateHall);
router.route("/delete/:id").delete(deleteHall);
router
  .route("/reservations")
  .get(getHallsWithReservationsByReservationDateRange);

module.exports = router;
