import httpStatus from "http-status";
import { Request, Response, NextFunction } from "express";
import APIError from "../utility/APIError";
import { ToDo, User } from "../models/index.model";
import { UpdateUserPayload } from "../dto/index.dto";
import { ErrMessages, SuccessMessages } from "../helpers/message_const";

/**
 * get user by id
 */
async function getUserById(req: Request, res: Response, next: NextFunction) {
  try {
    const filter = { _id: req.user._id };

    let userExist = await User.findOne(filter);
    if (!userExist)
      return next(
        new APIError(ErrMessages.userNotFound, httpStatus.BAD_REQUEST, true)
      );

    const userDetail = await User.findOne(filter);
    next(userDetail);
  } catch (err) {
    return next(
      new APIError(err.message, httpStatus.INTERNAL_SERVER_ERROR, true)
    );
  }
}

/**
 * update user
 */
async function updateUser(req: Request, res: Response, next: NextFunction) {
  try {
    const { name, phone, email } = <UpdateUserPayload>req.body;
    let updateObj: UpdateUserPayload = {};

    if (name) updateObj.name = name;
    if (phone) updateObj.phone = phone;
    if (email) {
      let emailExist = await User.findOne({
        email,
        _id: { $ne: Object(req.user._id) },
      });
      if (emailExist)
        return next(
          new APIError(ErrMessages.sameUser, httpStatus.BAD_REQUEST, true)
        );
      updateObj.email = email;
    }

    let updatedUser = await User.findOneAndUpdate(
      { _id: req.user._id },
      updateObj,
      { new: true }
    );

    next({ message: SuccessMessages.userUpdated, data: updatedUser });
  } catch (err) {
    return next(
      new APIError(err.message, httpStatus.INTERNAL_SERVER_ERROR, true)
    );
  }
}

/**
 * delete user
 */
async function deleteUser(req: Request, res: Response, next: NextFunction) {
  try {
    const filter = { _id: req.user._id };
    const updateObj = { isDeleted: true, activeSessions: [] };

    let userExist = await User.findOne(filter);
    if (!userExist)
      return next(
        new APIError(ErrMessages.userNotFound, httpStatus.BAD_REQUEST, true)
      );

    let todoExist = await ToDo.findOne({
      createdBy: req.user._id,
      isDeleted: false,
    });
    if (todoExist)
      return next(
        new APIError(
          ErrMessages.noAccessDeleteUser,
          httpStatus.BAD_REQUEST,
          true
        )
      );

    await User.findOneAndUpdate(filter, { ...updateObj });
    next(SuccessMessages.userDeleted);
  } catch (err) {
    return next(
      new APIError(err.message, httpStatus.INTERNAL_SERVER_ERROR, true)
    );
  }
}

export const user = {
  getUserById,
  updateUser,
  deleteUser,
};
