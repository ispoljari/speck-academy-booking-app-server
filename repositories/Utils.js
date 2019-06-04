const mapReservations = dbReservations => ({
  id: dbReservations.id,
  hallFk: dbReservations.hall_fk,
  reservationTitle: dbReservations.reservation_title,
  reservationDescription: dbReservations.reservation_description,
  reservationStatus: dbReservations.reservation_status,
  reservationDate: dbReservations.reservation_date,
  reservationStartTime: dbReservations.reservation_start_time,
  reservationEndTime: dbReservations.reservation_end_time,
  citizenFullName: dbReservations.citizen_full_name,
  citizenOrganization: dbReservations.citizen_organization,
  citizenEmail: dbReservations.citizen_email,
  citizenPhoneNumber: dbReservations.citizen_phone_number,
  createdAt: dbReservations.created_at,
  updatedAt: dbReservations.updated_at,
  ...(dbReservations.hall ? { hall: mapHalls(dbReservations.hall) } : {})
});

const mapHalls = dbHall => ({
  id: dbHall.id,
  name: dbHall.name,
  address: dbHall.address,
  pictureUrl: dbHall.picture_url,
  description: dbHall.description,
  createdAt: dbHall.created_at,
  updatedAt: dbHall.updated_at,
  ...(dbHall.hall_reservations
    ? { hallReservaltions: dbHall.hall_reservations.map(mapReservations) }
    : {})
});

module.exports = {
  mapHalls,
  mapReservations
};
