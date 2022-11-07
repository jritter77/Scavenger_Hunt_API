let createError = require("http-errors");
let express = require("express");
let path = require("path");
let cookieParser = require("cookie-parser");
let logger = require("morgan");
let jwt = require("jsonwebtoken");
let dotenv = require("dotenv").config();
let mongoose = require("mongoose");
let cors = require("cors");

let indexRouter = require("./routes/index");
let usersRouter = require("./routes/users");
let huntsRouter = require("./routes/hunts");
let friendsRouter = require("./routes/friends");
let groupsRouter = require("./routes/groups");

let app = express();

dotenv.config();

mongoose.connect("mongodb://127.0.0.1/LookoutDB");

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/hunts", huntsRouter);
app.use("/friends", friendsRouter);
app.use("/groups", groupsRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
