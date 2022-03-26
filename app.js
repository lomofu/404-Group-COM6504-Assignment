/** @format */

const createError = require("http-errors");
const express = require("express");
const bodyParser = require("body-parser");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
require("./config/dbConfig");

const publicRouter = require("./routes/public");
const indexRouter = require("./routes/view");
const usersRouter = require("./routes/users");
const storyRouter = require("./routes/story");

const app = express();

// swagger
const openApiDocumentation = require('./swagger/swaggerDocumentation.json');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openApiDocumentation));

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "../")));

app.use("/", indexRouter);
app.use("/public", publicRouter);
app.use("/users", usersRouter);
app.use("/api/story", storyRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
    next(createError(404));
});

// error handler
app.use((err, req, res) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render("error");
});

module.exports = app;
