import { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";

export function authenticate(req: Request, res: Response, next: NextFunction) {
  if (!req.session || !req.session.data) {
    return next(createHttpError(401, "You must be logged in to proceed!"));
  }
  next();
}
