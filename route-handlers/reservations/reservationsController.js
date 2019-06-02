const db = require("../../db/connect");
const express = require("express");
const {
  HTTP_STATUS_CODES,
  RESERVATION_TYPES,
  isValueValidEnum
} = require("../../enums");

const getReservations = (request, response) => {
  db.query("SELECT * FROM Reservations ORDER BY id ASC")
    .then(res => response.status(HTTP_STATUS_CODES.OK).json(res.rows))
    .catch(error => {
      throw error;
    });
};

const getReservationById = (request, response) => {
  const id = parseInt(request.params.id);
  db.query("SELECT * FROM Reservations WHERE id = $1", [id])
    .then(res => response.status(HTTP_STATUS_CODES.OK).json(res.rows[0]))
    .catch(error => {
      throw error;
    });
};

const createReservation = (request, response) => {
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
  const hallFk = parseInt(body.hallFk);
  const reservationStatus = RESERVATION_TYPES.PENDING;

  db.query(
    `INSERT INTO Reservations (hall_fk, reservation_title, reservation_description, reservation_status, reservation_date,
         reservation_start_time, reservation_end_time, citizen_full_name, citizen_organization, citizen_email, citizen_phone_number)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
    [
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
    ]
  )
    .then(res => response.status(HTTP_STATUS_CODES.CREATED).json({}))
    .catch(error => {
      throw error;
    });
};

const updateReservationStatus = (request, response, next) => {
  const { body, params } = request;
  const id = parseInt(params.id);
  const reservationStatus = body.reservationStatus;
  if (!isValueValidEnum(reservationStatus, RESERVATION_TYPES)) {
    next({
      status: HTTP_STATUS_CODES.BAD_REQUEST,
      message: "Invalid enum value"
    });
  }
  const updatedAt = new Date();

  db.query(
    "UPDATE Reservations SET reservation_status = $1, updated_at = $2 WHERE id = $3",
    [reservationStatus, updatedAt, id]
  )
    .then(res => response.status(HTTP_STATUS_CODES.OK).json({}))
    .catch(error => {
      throw error;
    });
};

const deleteReservation = (request, response) => {
  const id = parseInt(request.params.id);

  db.query("DELETE FROM Reservations WHERE id = $1", [id])
    .then(() => response.status(HTTP_STATUS_CODES.OK).json({}))
    .catch(error => {
      throw error;
    });
};

const getReservationsByReservationStatus = async (request, response) => {
  const dbResponse = await db.query(`SELECT Reservations.*, row_to_json((SELECT d FROM (SELECT halls.*) d)) AS hall
  FROM Reservations JOIN Halls ON hall_Fk = halls.id
  WHERE reservation_status = 'pending'`);
  response.status(HTTP_STATUS_CODES.OK).json(dbResponse.rows);
};

const router = new express.Router();

router.route("/").get(getReservations);
router.route("/pending").get(getReservationsByReservationStatus);
router.route("/create").post(createReservation);
router.route("/:id").get(getReservationById);
router.route("/update/:id").patch(updateReservationStatus);
router.route("/delete/:id").delete(deleteReservation);

module.exports = router;
