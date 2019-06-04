const express = require("express");
const { adminLogin } = require("./controller");

const router = new express.Router();

router.route("/login").post(adminLogin);

module.exports = router;
