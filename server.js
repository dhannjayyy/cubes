const express = require("express");
const app = express();
const cors = require("cors");
const { logger } = require("./middlewares/logEvents");
const errorHandler = require("./middlewares/errorHandller");
const corsOptions = require("./Config/corsOptions");
const { configDB, emitter } = require("./Config/configDB");
const verifyJWT = require("./middlewares/verifyJWT");
const cookieParser = require("cookie-parser");
const credentials = require("./middlewares/credentials");
const PORT = process.env.PORT || 3500;

try {
  configDB();
} catch (error) {
  console.log(error.message);
}

app.use(logger);
app.use(cookieParser());
app.use(credentials);
app.use(cors(corsOptions));
// app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("hello ");
});

app.use("/register", require("./Api/register"));
app.use("/auth", require("./Api/auth"));
app.use("/refresh", require("./Api/refresh"));

// verifyJWT is before tasks route because we want to make tasks route as protected only
app.use(verifyJWT);
app.use("/tasks", require("./Api/tasks"));

app.all("*", (req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    res.send("<div>Not found 404</div>");
  } else if (req.accepts("json")) {
    res.json({ error: "404 Not Found" });
  } else {
    res.type("txt").send("404 Not Found");
  }
});

app.use(errorHandler);

emitter.once("connectionSuccessful", () => {
  console.log("connected to DB");
  app.listen(PORT, () => {
    console.log(`lsitening on port ${PORT}`);
  });
});
