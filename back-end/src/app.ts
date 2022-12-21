import express, { Application, Request, Response, NextFunction } from "express";
import cookieParser from "cookie-parser";
import cors, { CorsOptions } from "cors";
import mongoose from "mongoose";
import csrf from "csurf";
import * as dotenv from "dotenv";

dotenv.config({ path: `.env.${process.env.NODE_ENV}`.trim() });

import { ErrorWithStatus } from "./common_interfaces";

import mongooseAPI from "./mongoose_api";
import routesInitialize from "./routes";

const app: Application = express();
const csrfDefence = csrf({ cookie: { httpOnly: true } });
mongooseAPI.connectDB();
app.use(express.json());
app.use(cookieParser());

const whitelist: string[] = (process.env.WHITELIST as string).split(" ");

const corsOptions: CorsOptions = {
  origin: (
    origin: string | undefined,
    callback: (err: Error | null, origin?: boolean) => void
  ): void => {
    if (origin === undefined || whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.get(
  process.env.REACT_APP_CSRF as string,
  csrfDefence,
  function (req: Request, res: Response) {
    // pass the csrfToken to the view
    // res.render('send', { csrfToken: req.csrfToken() })
    res.send({ csrfToken: req.csrfToken() });
  }
);

app.use(routesInitialize);

app.use((request: Request, response: Response, next: NextFunction) => {
  const error: ErrorWithStatus = {
    message: "URL not found",
    status: 404,
  };
  next(error);
});

app.use(
  (
    error: ErrorWithStatus,
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    response
      .status(error.status || 500)
      .json({ error: { message: error.message } });
  }
);
mongoose.connection.once("open", () => {
  console.log("Connected to mongodb atlas");
  app.listen(5000);
});
