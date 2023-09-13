import { Router } from "express";
import {
    checkRole,
    checkAuth,
    checkStatus,
} from "../middlewares/autorization.js";
import userController from "../controllers/users.controller.js";
import { documentsUploader } from "../middlewares/filesUpload.js";

const userRouter = Router();

// Hay que documentar este endpoint
userRouter.get(
    "/",
    userController.getAllUsers
);

userRouter.delete(
    "/",
    checkRole(["admin"]),
    userController.deleteInactiveUsers
);

userRouter.delete(
    "/:uid",
    checkRole(["admin"]),
    userController.deleteUser
);

userRouter.get(
    "/premium/:uid",
    checkRole(["admin"]),
    checkStatus,
    userController.changeRole
);

userRouter.put(
    "/:uid/documents",
    checkAuth,
    documentsUploader.fields([
        { name: "identificacion", maxCount: 1 },
        { name: "domicilio", maxCount: 1 },
        { name: "estadoDeCuenta", maxCount: 1 },
    ]),
    userController.updateUser
);

export default userRouter;
