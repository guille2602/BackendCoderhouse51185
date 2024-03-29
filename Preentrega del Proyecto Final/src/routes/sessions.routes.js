import { Router } from "express";
import passport from "passport";
import sessionController from "../controllers/users.controller.js";
import { profileUploader } from "../middlewares/filesUpload.js";

const sessionRouter = Router();

//Github login
sessionRouter.get(
    "/github",
    passport.authenticate("github", { scope: ["user:email"] }),
    async (req, res) => {}
);
sessionRouter.get(
    "/githubcallback",
    passport.authenticate("github", { failureRedirect: "/login" }),
    sessionController.gitHubLogin
);

//Mongo login
sessionRouter.get("/faillogin", sessionController.failedLogin);
sessionRouter.post(
    "/login",
    passport.authenticate("login", { failureRedirect: "/api/sessions/faillogin" }),
    sessionController.login
);
sessionRouter.get("/failregister", sessionController.failedRegister);

sessionRouter.post( "/register",
    profileUploader.single("avatar"),
    passport.authenticate("register", { failureRedirect: "/api/sessions/failregister" }),
    sessionController.sucessRegister
);
sessionRouter.get("/logout", sessionController.logout);
sessionRouter.get("/current", sessionController.currentUser);

sessionRouter.post("/forgot-password", sessionController.passwordRecovery);

sessionRouter.post("/reset-password", sessionController.resetPassword);

export default sessionRouter;