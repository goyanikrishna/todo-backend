import express from "express";
import { validate } from "express-validation";
import userParams from "../params/user.params";
import { user } from "../controllers/user.controller";

const router = express.Router();

router
  .route("/getUser")
  /** GET user/getUser - get user profile */
  .get( user.getUserById);

router
  .route("/updateUser")
  /** PUT user/updateUser - update user profile */
  .put(validate(userParams.updateUser), user.updateUser);

router
  .route("/deleteUser")
  /** DELETE admin/deleteUser - delete users */
  .delete(user.deleteUser);

export { router as userRouter };
