// test code

const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
const { PORT, CLIENT_ORIGIN, HTTP_STATUS_CODES } = require("./config");

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

app.use(cors({
  origin: CLIENT_ORIGIN
}));

// demo endpoints

app.get("/", (req, res) => {
  return res.json("Hello World from Express!");
});

app.get("/api/users", (req, res) => {
  return res.json("Here is your list of users");
});

app.get("/api/halls", (req, res) => {
  return res.json("Here is your list of halls");
});

app.listen(port, () => {
  console.log(`Listening on port ${PORT}`);
});
