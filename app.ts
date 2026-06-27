import createError from "http-errors";
import express from "express";
import type { Request, Response, NextFunction } from "express";

import path from "path";
import { fileURLToPath } from "url";

import cookieParser from "cookie-parser";
import logger from "morgan";

//import cors from "cors";

import usersRouter from "./src/user/web/controllers/UserController.js";
import authRouter from "./src/room/web/controllers/AuthController.js";
import roomsRouter from "./src/room/web/controllers/RoomController.js";

import Middleware from "./src/shared/security/Middleware.js";
import { config } from "./src/config.js";

const app = express();
/*
 * __dirname replacement for ESM
 */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const clientHost = config.CLIENT_HOST! as string;

/*
 * Middlewares
 */
app.use(logger("dev"));

app.use(express.json());

app.use(
  express.urlencoded({
    extended: false,
  }),
);

// Adds headers : Access-control-Allow-Origin: *
//app.use(
//cors({
//origin: clientHost,
//credentials: true,
//}),
//);
//app.options("*", cors());

app.use(cookieParser());

app.use(express.static(path.join(__dirname, "public")));

/*
 * Routes
 */
app.use("/api/auth", authRouter);

app.use("/api/users", Middleware, usersRouter);
app.use("/api/rooms", Middleware, roomsRouter);

/*
 * Catch 404
 */
app.use((req: Request, res: Response, next: NextFunction) => {
  next(createError(404));
});

/*
 * Error handler
 */
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  res.locals.message = err.message;

  res.locals.error = req.app.get("env") === "development" ? err : {};
  console.error(err);

  res.status(err.status || 500).json({
    error: err.message,
    stack: err.stack,
  });
});

export default app;
