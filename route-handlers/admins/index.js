const express = require("express");
const { adminLogin, adminLogout } = require("./controller");

const router = new express.Router();

router.route("/login").post(adminLogin);
router.route("/logout").post(adminLogout);

module.exports = router;
