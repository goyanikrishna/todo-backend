import express from "express";
import { middleware } from "../utility/index";
import { authRouter } from "./auth.route";
import { userRouter } from "./user.route";
import { todoRouter } from "./todo.route";

const router = express.Router();

router.use("/auth", authRouter);

/* authorized routes APIs */
router.use(middleware.authorize);

router.use("/user", userRouter);
router.use("/todo", todoRouter);

export { router as indexRouter };
