import httpStatus from "http-status";
import { Request, Response, NextFunction } from "express";
import APIError from "../utility/APIError";
import jwt from "jsonwebtoken";
import config from "../config/index";
import { User } from "../models/index.model";
import { ErrMessages } from "../helpers/index.helpers";
import { ErrorType } from "../dto/global.dto";

/**
 * autorize middleware to check if user is logged in or not
 */
async function authorize(req: Request, res: Response, next: NextFunction) {
  try {
    let token: string;
    let error: string;
    if (req.headers.authorization) {
      if (
        typeof req.headers.authorization !== "string" ||
        req.headers.authorization.indexOf("Bearer ") === -1
      ) {
        error = ErrMessages.badAuth;
      } else {
        token = req.headers.authorization.split(" ")[1];
      }
    } else {
      error = ErrMessages.tokenNot;
    }

    if (!token && error) {
      return next(new APIError(error, httpStatus.UNAUTHORIZED, true));
    }

    return jwt.verify(
      token,
      config.jwtSecret,
      async (err, decoded: { userId: any }) => {
        if (err || !decoded || !decoded.userId) {
          return next(
            new APIError(ErrMessages.badToken, httpStatus.UNAUTHORIZED, true)
          );
        }
        const userObj = await User.findOne({ _id: decoded.userId });
        if (!userObj)
          return next(
            new APIError(ErrMessages.userNotFound, httpStatus.NOT_FOUND, true)
          );
        if (!userObj.activeSessions.includes(token))
          return next(
            new APIError(
              ErrMessages.sessionExpired,
              httpStatus.UNAUTHORIZED,
              true
            )
          );

        req.user = userObj;
        return next();
      }
    );
  } catch (err: any) {
    return next(
      new APIError(err.message, httpStatus.INTERNAL_SERVER_ERROR, true)
    );
  }
}

export const middleware = {
  authorize,
};
