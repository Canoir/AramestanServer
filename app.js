const express = require("express");
const createError = require("http-errors");
const bodyParser = require("body-parser");
const path = require("path");
const cookieParser = require("cookie-parser");
const moment = require("jalali-moment");
const logger = require("morgan");
//Db Config
require("./config/db")();
//Router
const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const deadsRouter = require("./routes/deads");
const apiDeadsRouter = require("./routes/api/apiDeads");
const statesRouter = require("./routes/states");
const apiStatesRouter = require("./routes/api/apiStates");
const deadtypesRouter = require("./routes/deadtype");
const costsRouter = require("./routes/costs");
const reportsRouter = require("./routes/reports");
const statementRouter = require("./routes/statements");
//App
const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "vash");
// Uses
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());
app.use((req, res, next) => {
  moment.locale("fa", { useGregorianParser: true });
  res.locals.moment = moment;
  next();
});

//Router
app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/deads", deadsRouter);
app.use("/api/deads", apiDeadsRouter);
app.use("/states", statesRouter);
app.use("/api/states", apiStatesRouter);
app.use("/deadtypes", deadtypesRouter);
app.use("/costs", costsRouter);
app.use("/reports", reportsRouter);
app.use("/statements", statementRouter);
//

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  res.status(err.status || 500);
  res.render("error");
});
module.exports = app;
