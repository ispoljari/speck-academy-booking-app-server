const db = require("../db/connect");
const { mapHalls } = require("./utils");

const getAll = async () => {
  const dbResponse = await db.query("SELECT * FROM Halls ORDER BY id ASC");
  return dbResponse.rows.map(mapHalls);
};

const getById = async id => {
  const dbResponse = await db.query("SELECT * FROM Halls WHERE id = $1", [id]);
  return dbResponse.rows.length > 0 ? mapHalls(dbResponse.rows[0]) : null;
};

const create = async (name, address, pictureUrl, description) => {
  await db.query(
    `INSERT INTO Halls (name, address, picture_url, description) 
    VALUES ($1, $2, $3, $4)`,
    [name, address, pictureUrl, description]
  );
};

const update = async (name, address, pictureUrl, description, id) => {
  const updatedAt = new Date();
  await db.query(
    "UPDATE Halls SET name = $1, address = $2, picture_url = $3, description = $4, updated_at = $5 WHERE id = $6",
    [name, address, pictureUrl, description, updatedAt, id]
  );
};

const deleteById = async id => {
  const dbResponse = await db.query("DELETE FROM Halls WHERE id = $1", [id]);
  return dbResponse.rows.length > 0 ? mapHalls(dbResponse.rows[0]) : null;
};

const getAllWithReservationsByReservationDateRange = async (
  startDate,
  endDate
) => {
  const dbResponse = await db.query(
    `
    SELECT Halls.*, json_agg(reservations.*) as hall_reservations
    FROM Halls JOIN reservations ON Halls.id = hall_fk
    WHERE reservation_date BETWEEN $1 AND $2 AND reservation_status = 'approved' 
    GROUP BY Halls.id`,
    [startDate, endDate]
  );

  return dbResponse.rows.map(mapHalls);
};

const getByIdWithReservations = async (id, reservationDate) => {
  const dbResponse = await db.query(
    `SELECT Halls.*, json_agg(reservations.*) as hall_reservations
  FROM Halls JOIN reservations ON Halls.id = hall_fk
  WHERE Halls.id = $1 AND reservation_date = $2
  GROUP BY Halls.id`,
    [id, reservationDate]
  );
  return dbResponse.rows.length > 0 ? mapHalls(dbResponse.rows[0]) : null;
};

const getHallByName = async name => {
  const dbResponse = await db.query(`SELECT * FROM Halls WHERE name = $1`, [
    name
  ]);
  return dbResponse.rows.length > 0 ? mapHalls(dbResponse.rows[0]) : null;
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  deleteById,
  getAllWithReservationsByReservationDateRange,
  getByIdWithReservations,
  getHallByName
};
