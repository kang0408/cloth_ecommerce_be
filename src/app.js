const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const morgan = require("morgan");
const { default: httpStatus } = require("http-status");
const compression = require("compression");
require("dotenv").config();

const router = require("./routes/v1/index.routes");
const database = require("./configs/database");
const swaggerDocs = require("./swagger");

// connect to database
database.connect();

// init express
const app = express();

// morgan
app.use(morgan("dev"));
// cors
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);
// helmet
app.use(helmet());
// parse json request body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// gzip compression
app.use(compression());

// router
router(app);

// swagger
swaggerDocs(app);

// catch all wildcard
app.all("*", (req, res) => {
  res.status(httpStatus.NOT_FOUND).json({
    status: httpStatus.NOT_FOUND,
    message: `API ${req.url} with method ${req.method} not found!`
  });
});

module.exports = app;
