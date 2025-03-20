import httpStatus from "http-status";
import { Request, Response, NextFunction } from "express";
import APIError from "../utility/APIError";
import { ToDo } from "../models/index.model";
import { ListToDoPayload, UpdateToDoPayload } from "../dto/index.dto";
import { ErrMessages, SuccessMessages } from "../helpers/message_const";

/**
 * create todo
 */
async function createToDo(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user._id;
    await ToDo.create({ ...req.body, createdBy: userId });
    next(SuccessMessages.todoCreated);
  } catch (err) {
    return next(
      new APIError(err.message, httpStatus.INTERNAL_SERVER_ERROR, true)
    );
  }
}

/**
 * list todos
 */
async function listToDos(req: Request, res: Response, next: NextFunction) {
  try {
    let {
      searchString,
      page_size = 10,
      page_number = 1,
    } = <ListToDoPayload>req.body;

    const select = "_id title name description";
    const populate = [
      {
        path: "createdBy",
        select: "name",
      },
    ];

    let filter = {
      isDeleted: false,
      createdBy: req.user._id,
    };

    let searchFilter = {
      $or: [
        { title: { $regex: searchString, $options: "i" } },
        { name: { $regex: searchString, $options: "i" } },
        { description: { $regex: searchString, $options: "i" } },
      ],
    };

    if (searchString && searchString.length > 0) {
      filter = { ...filter, ...searchFilter };
    }

    const totalRecords = await ToDo.find(filter).countDocuments();
    const page_count = Math.ceil(totalRecords / page_size) || 1;

    const todos = await ToDo.find(filter)
      .select(select)
      .populate(populate)
      .skip((page_number - 1) * page_size)
      .limit(page_size)
      .sort({ createdAt: -1 });

    next({ todos, totalRecords, page_count: page_count });
  } catch (err) {
    return next(
      new APIError(err.message, httpStatus.INTERNAL_SERVER_ERROR, true)
    );
  }
}

/**
 * update todo
 */
async function updateToDo(req: Request, res: Response, next: NextFunction) {
  try {
    const { todoId, title, name, description } = <UpdateToDoPayload>req.body;
    let updateObj: UpdateToDoPayload = {};

    let todoExist = await ToDo.findOne({
      _id: todoId,
      createdBy: req.user._id,
    });
    if (!todoExist)
      return next(
        new APIError(ErrMessages.todoNotFound, httpStatus.BAD_REQUEST, true)
      );

    if (title) updateObj.title = title;
    if (name) updateObj.name = name;
    if (description) updateObj.description = description;

    let updatedToDo = await ToDo.findOneAndUpdate({ _id: todoId }, updateObj, {
      new: true,
    });

    next({ message: SuccessMessages.todoUpdated, data: updatedToDo });
  } catch (err) {
    return next(
      new APIError(err.message, httpStatus.INTERNAL_SERVER_ERROR, true)
    );
  }
}

/**
 * delete todo
 */
async function deleteToDo(req: Request, res: Response, next: NextFunction) {
  try {
    const filter = { _id: req.query.todoId, createdBy: req.user._id };
    const updateObj = { isDeleted: true };

    let todoExist = await ToDo.findOne(filter);
    if (!todoExist)
      return next(
        new APIError(ErrMessages.todoNotFound, httpStatus.BAD_REQUEST, true)
      );

    await ToDo.findOneAndUpdate(filter, { ...updateObj });
    next(SuccessMessages.todoDeleted);
  } catch (err) {
    return next(
      new APIError(err.message, httpStatus.INTERNAL_SERVER_ERROR, true)
    );
  }
}

export const todo = {
  createToDo,
  listToDos,
  updateToDo,
  deleteToDo,
};
