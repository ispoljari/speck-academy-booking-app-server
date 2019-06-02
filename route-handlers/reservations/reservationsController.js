const db = require("../../db/connect");
const express = require("express");
const { HTTP_STATUS_CODES } = require("../../config");

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
    reservationStatus,
    citizenFullName,
    citizenOrganization,
    citizenEmail,
    citizenPhoneNumber
  } = body;
  const hallFk = parseInt(body.hallFk);
  const reservationDate = new Date(body.reservationDate)
    .toISOString()
    .slice(0, 10); // YYYY-MM-DD
  const reservationStartTime = new Date(body.reservationStartTime); // HH:MM:SS
  const reservationEndTime = new Date(body.reservationEndTime); // HH:MM:SS

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

const updateReservation = (request, response) => {
  const { body, params } = request;
  const {
    reservationTitle,
    reservationDescription,
    reservationStatus,
    citizenFullName,
    citizenOrganization,
    citizenEmail,
    citizenPhoneNumber
  } = body;
  const id = parseInt(params.id);
  const hallFk = parseInt(body.hallFk);
  const reservationDate = new Date(body.reservationDate)
    .toISOString()
    .slice(0, 10); // YYYY-MM-DD
  const reservationStartTime = new Date(body.reservationStartTime); // HH:MM:SS
  const reservationEndTime = new Date(body.reservationEndTime); // HH:MM:SS
  const updatedAt = new Date();

  db.query(
    `UPDATE Reservations SET hallFK = $1, reservation_title = $2, reservation_description = $3, reservation_status = $4,
         reservation_date = $5, reservation_start_time = $6, reservation_end_time = $7, citizen_full_name = $8,
         citizen_organization = $9, citizen_email = $10, citizen_phone_number = $11, updated_at = $12 WHERE id = $13`,
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
      citizenPhoneNumber,
      updatedAt,
      id
    ]
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

const router = new express.Router();

router.route("/").get(getReservations);
router.route("/:id").get(getReservationById);
router.route("/create").post(createReservation);
router.route("/update/:id").put(updateReservation);
router.route("/delete/:id").delete(deleteReservation);

module.exports = router;
