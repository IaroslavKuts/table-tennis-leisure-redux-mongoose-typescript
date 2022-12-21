import { Request, Response, NextFunction } from "express";
import { ErrorWithStatus } from "../common_interfaces";
const isAdmin = (request: Request, response: Response, next: NextFunction) => {
  const { authorities } = response.locals;
  console.log(`Authorities in isAdmin Function${authorities}`);
  if (authorities !== "admin") {
    const error: ErrorWithStatus = {
      message: "Permission declined. This user does not admin rights",
      status: 403,
    };
    next(error);
    return;
  }
  next();
};

const roleVerifiers = { isAdmin };
export default roleVerifiers;
