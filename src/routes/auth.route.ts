import express from "express";
import { validate } from "express-validation";
import authParams from "../params/auth.params";
import { auth } from "../controllers/auth.controller";

const router = express.Router();

router
  .route("/registerUser")
  /** POST auth/registerUser - register user */
  .post(validate(authParams.registerUser), auth.registerUser);

router
  .route("/login")
  /** POST auth/login - user login */
  .post(validate(authParams.login), auth.login);

export { router as authRouter };
