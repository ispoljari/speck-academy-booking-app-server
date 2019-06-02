const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const { PORT, CLIENT_ORIGIN, HTTP_STATUS_CODES } = require("./config");
const {
  hallsHandler,
  reservationsHandler,
  adminsHandler
} = require("./route-handlers");

const router = new express.Router();

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

app.use(
  cors({
    origin: CLIENT_ORIGIN
  })
);

// Base routes
app.use((req, res, next) => {
  // TODO: find admins by token.
  next();
});
app.use("/api/halls", hallsHandler);
app.use("/api/reservations", reservationsHandler);
app.use("/api/admins", adminsHandler);

app.use("*", (req, res) =>
  res.status(HTTP_STATUS_CODES.NOT_FOUND).json({
    message: "Invalid URL"
  })
);

app.listen(PORT, () => console.log(`Server Listening on port ${PORT}!`));
