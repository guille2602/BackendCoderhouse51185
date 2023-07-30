import { Router } from "express";
import { checkRole } from "../middlewares/autorization.js";
import userController from "../controllers/users.controller.js";

const userRouter = Router();

userRouter.get("/premium/:uid", checkRole(["admin"]), userController.changeRole);

export default userRouter;