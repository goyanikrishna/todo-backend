import express from "express";
import { validate } from "express-validation";
import todoParams from "../params/todo.params";
import { todo } from "../controllers/todo.controller";

const router = express.Router();

router
  .route("/createToDo")
  /** POST todo/createToDo - create todo */
  .post(validate(todoParams.createToDo), todo.createToDo);

router
  .route("/listToDos")
  /** POST todo/listToDos - list todos */
  .post(validate(todoParams.listToDos), todo.listToDos);

router
  .route("/updateToDo")
  /** PUT todo/updateToDo - update todo */
  .put(validate(todoParams.updateToDo), todo.updateToDo);

router
  .route("/deleteToDo")
  /** DELETE todo/deleteToDo - delete todo */
  .delete(validate(todoParams.deleteToDo), todo.deleteToDo);

export { router as todoRouter };
