import jwt from "jsonwebtoken";
import { ErrorWithStatus } from "../common_interfaces";
import { Request, Response, NextFunction } from "express";

import { VerifiedUser } from "../controllers/controllers_interfaces";
//Function that verifies jwtToken
const verifyJWT = (
  request: Request,
  response: Response,
  next: NextFunction
): void => {
  let jwtRefreshToken = request.cookies["jwtRefreshToken"];
  if (!jwtRefreshToken) {
    const error: ErrorWithStatus = {
      message: "Middleware. jwtToken is undefined",
      status: 401,
    };

    next(error);
  }

  try {
    const verifiedUser: VerifiedUser = jwt.verify(
      jwtRefreshToken,
      process.env.JWT_TOKEN as string

      // (err: Error | null, decoded: string): void => {
      //   if (err) {
      //     const error: ErrorWithStatus = { message: err.message, status: 500 };
      //     next(error);
      //     return;
      //   }

      //   response.locals._id = decoded["_id"];
      //   response.locals.authorities = decoded["authorities"];

      //   next();
      // }
    ) as VerifiedUser;
    response.locals._id = verifiedUser["_id"];
    response.locals.authorities = verifiedUser["authorities"];
    response.locals.email = verifiedUser["email"];
    next();
  } catch (err: unknown) {
    if (err instanceof Error) {
      const error: ErrorWithStatus = { message: err.message, status: 500 };
      next(error);
    }
  }
};

export default verifyJWT;
