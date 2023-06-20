import { Router } from "express";
import passport from "passport";
import sessionController from "../controllers/users.controller.js";

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
sessionRouter.post(
    "/register",
    passport.authenticate("register", { failureRedirect: "/api/sessions/failregister" }),
    sessionController.sucessRegister
);
sessionRouter.get("/logout", sessionController.logout);
sessionRouter.get("/current", sessionController.currentUser);

export default sessionRouter;