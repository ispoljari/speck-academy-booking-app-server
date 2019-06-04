const express = require("express");
const {
  getReservations,
  getReservationById,
  createReservation,
  updateReservationStatus,
  deleteReservation,
  getReservationsByReservationStatus
} = require("./controller");
const router = new express.Router();

router.route("/").get(getReservations);
router.route("/pending").get(getReservationsByReservationStatus);
router.route("/create").post(createReservation);
router.route("/:id").get(getReservationById);
router.route("/update/:id").patch(updateReservationStatus);
router.route("/delete/:id").delete(deleteReservation);

module.exports = router;
