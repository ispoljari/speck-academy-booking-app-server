// test code

const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

app.get("/", (req, res) => {
  return res.json("Hello World from Express!");
});

// demo endpoints
app.get("/api/users", (req, res) => {
  return res.json("Here is your list of users");
});

app.get("/api/halls", (req, res) => {
  return res.json("Here is your list of halls");
});

// in production route all requests to client/build/index.html
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "client/build")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client/build", "index.html"));
  });
}

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
