import express from "express";
import { Application } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import httpStatus from "http-status";
import compression from "compression";

require("dotenv").config();

import router from "./routes/v1/index.routes";
import connect from "./configs/database";
import swaggerDocs from "./swagger";

// connect to database
connect();

// init express
const app: Application = express();

// morgan
app.use(morgan("dev"));
// cors
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
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

export default app;
