/** @format */

const express = require("express");
const swaggerUi = require("swagger-ui-express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const Exception = require("./util/exception");

require("./config/dbConfig");
require("swagger-jsdoc");

const publicRouter = require("./routes/public");
const indexRouter = require("./routes/view");
const storyRouter = require("./routes/story");
const roomRouter = require("./routes/room");

const app = express();

// swagger
const openApiDocumentation = require("./swagger/swaggerDocumentation.json");
app.use("/swagger", swaggerUi.serve, swaggerUi.setup(openApiDocumentation));

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "../")));

app.use("/", indexRouter);
app.use("/public", publicRouter);
app.use("/api/story", storyRouter);
app.use("/api/room", roomRouter);

// forward to error handler
app.use((e, req, res, next) => {
  if (e) {
    next(e);
  }
  next(new Exception(404, "Page Not Found"));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  if (err.code === 404) {
    next();
  }

  // return as a json
  res.locals.message = err.message;
  res.status(err.code);
  res.json(err.message);
});

// 404 handler
app.use((req, res) => res.render("404"));

module.exports = app;
