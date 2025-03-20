import httpStatus from "http-status";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import APIError from "../utility/APIError";
import config from "../config/index";
import { AuthPayload } from "../dto/index.dto";
import { User } from "../models/index.model";
import { ErrMessages, SuccessMessages } from "../helpers/index.helpers";
import { CreateUserPayload } from "../dto/index.dto";

/**
 * register user
 */
async function registerUser(req: Request, res: Response, next: NextFunction) {
  try {
    const { email } = <CreateUserPayload>req.body;

    let userExist = await User.findOne({ email });
    if (userExist)
      return next(
        new APIError(ErrMessages.userExist, httpStatus.BAD_REQUEST, true)
      );

    const userData = await User.create({ ...req.body });

    const token = jwt.sign(
      { userId: userData?._id, email: userData?.email },
      config.jwtSecret,
      {
        expiresIn: config.expiresIn,
      }
    );
    await User.updateOne(
      { _id: userData._id },
      { $push: { activeSessions: { $each: [token], $slice: -10 } } }
    );

    next({
      message: SuccessMessages.userCreated,
      _id: userData._id,
      name: userData.name,
      token,
    });
  } catch (err) {
    return next(
      new APIError(err.message, httpStatus.INTERNAL_SERVER_ERROR, true)
    );
  }
}

/**
 * login
 */
async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = <AuthPayload>req.body;

    let userExist = await User.findOne({ email });
    if (!userExist)
      return next(
        new APIError(ErrMessages.invalidEmail, httpStatus.BAD_REQUEST, true)
      );

    if (userExist.isDeleted && userExist.isDeleted === true) {
      return next(
        new APIError(ErrMessages.userNotExist, httpStatus.BAD_REQUEST, true)
      );
    }

    const validPass = await userExist.matchPassword(password);
    if (!validPass)
      return next(
        new APIError(
          ErrMessages.incorrectPassword,
          httpStatus.BAD_REQUEST,
          true
        )
      );

    const token = jwt.sign({ userId: userExist._id, email }, config.jwtSecret, {
      expiresIn: config.expiresIn,
    });
    await User.updateOne(
      { _id: userExist._id },
      { $push: { activeSessions: { $each: [token], $slice: -10 } } }
    );

    next({
      _id: userExist._id,
      name: userExist.name,
      token,
    });
  } catch (err: any) {
    return next(new APIError(err, httpStatus.INTERNAL_SERVER_ERROR, true));
  }
}

export const auth = {
  registerUser,
  login,
};
