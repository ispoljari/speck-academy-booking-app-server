const express = require("express");
const {
  getHalls,
  getHallById,
  createHall,
  updateHall,
  deleteHall,
  getHallsWithReservationsByReservationDateRange,
  getHallByIdWithReservations
} = require("./controller");

const router = new express.Router();

router.route("/").get(getHalls);
router.route("/create").post(createHall);
router
  .route("/reservations")
  .get(getHallsWithReservationsByReservationDateRange);
router.route("/:id").get(getHallById);
router.route("/update/:id").put(updateHall);
router.route("/delete/:id").delete(deleteHall);
router.route("/reservations/:id").get(getHallByIdWithReservations);

module.exports = router;
