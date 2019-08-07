const db = require("../db/connect");
const { mapReservations } = require("./utils");

const getAll = async () => {
  const dbResponse = await db.query(
    "SELECT * FROM Reservations ORDER BY id ASC"
  );
  return dbResponse.rows.map(mapReservations);
};

const getById = async id => {
  const dbResponse = await db.query(
    "SELECT * FROM Reservations WHERE id = $1",
    [id]
  );
  return dbResponse.rows.length > 0
    ? mapReservations(dbResponse.rows[0])
    : null;
};

const create = async (
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
) => {
  await db.query(
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
  );
};

const update = async (reservationStatus, id) => {
  const updatedAt = new Date();
  await db.query(
    "UPDATE Reservations SET reservation_status = $1, updated_at = $2 WHERE id = $3",
    [reservationStatus, updatedAt, id]
  );
};

const deleteById = async id => {
  await db.query("DELETE FROM Reservations WHERE id = $1", [id]);
};

const getAllByReservationStatus = async () => {
  const dbResponse = await db.query(`SELECT Reservations.*, row_to_json((SELECT d FROM (SELECT halls.*) d)) AS hall
  FROM Reservations JOIN Halls ON hall_Fk = halls.id
  WHERE reservation_status = 'pending'`);
  return dbResponse.rows.map(mapReservations);
};

const getAllOverlappingReservations = async (
  reservationDate,
  reservationStartTime,
  reservationEndTime,
  hallFk
) => {
  const dbResponse = await db.query(
    `SELECT * FROM Reservations WHERE reservation_date = $1 
  AND reservation_start_time < $2 AND reservation_end_time > $3 AND hall_fk = $4`,
    [reservationDate, reservationEndTime, reservationStartTime, hallFk]
  );
  return dbResponse.rows.map(mapReservations);
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  deleteById,
  getAllByReservationStatus,
  getAllOverlappingReservations
};
