require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const sessionRepository = require("./repositories/sessions");
const { DateTime } = require("luxon");
const cookieParser = require("cookie-parser");
const { PORT, CLIENT_ORIGIN, COOKIE_SECRET_KEY } = require("./config");
const { HTTP_STATUS_CODES } = require("./enums");
const {
  hallsHandler,
  reservationsHandler,
  adminsHandler
} = require("./route-handlers");
const { notFound } = require("./enums/error-responses");

const app = express();

app.use(
  cors({
    origin: CLIENT_ORIGIN,
    credentials: true
  })
);

app.use(bodyParser.json());

app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

app.use(cookieParser(COOKIE_SECRET_KEY));

// Base routes
app.use(async (req, res, next) => {
  try {
    const { sessionId } = req.signedCookies;
    const session = await sessionRepository.getById(sessionId);
    const isAdmin =
      Boolean(session) &&
      DateTime.local() <= DateTime.fromJSDate(session.expiryDate);
    req.isAdmin = isAdmin;
    next();
  } catch (error) {
    next(error);
  }
});

app.use("/api/halls", hallsHandler);
app.use("/api/reservations", reservationsHandler);
app.use("/api/admins", adminsHandler);

app.use((req, res, next) => next(notFound));

app.use((err, req, res, next) => {
  res.status(err.status || HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).send({
    message: err.message
  });
});

app.listen(PORT, () => console.log(`Server Listening on port ${PORT}!`));
