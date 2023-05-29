import { Router } from "express";
import userModel from "../dao/models/user.model.js";
import { createHash, validatePassword } from "../utils.js";
import passport from "passport";

const sessionRouter = Router();

sessionRouter.post(
    "/login",
    passport.authenticate("login", { failureRedirect: "/faillogin" }),
    async (req, res) => {
        if (!req.user) {
            res.status(400).send({
                status: "Sucess",
                message: "Credenciales inválidas",
            });
            return;
        }
        req.session.user = {
            name: `${req.user.firstName} ${req.user.lastName}`,
            email: req.user.email,
            age: req.user.age,
        };
        const isCoderPass = validatePassword(req.user, "adminCod3r123");
        if (
            req.user.email == "adminCoder@coder.com" &&
            isCoderPass
        ) {
            req.session.admin = true;
        } else {
            req.session.admin = false;
        }
        res.status(200).send({
            status: "Sucess",
            message: "Logueado correctamente",
            payload: req.res.user,
        });
    }
);

sessionRouter.get("/faillogin", (req, res) => {
    res.status(400).send({
        status: "Failed",
        message: "Fallo el logueo de usuario",
    });
});

sessionRouter.post(
    "/register",
    passport.authenticate("register", { failureRedirect: "/failregister" }),
    async (req, res) => {
        res.send({
            status: "Sucess",
            message: "Usuario creado existosamente",
        });
    }
);

sessionRouter.get("/failregister", (req, res) => {
    res.status(400).send({
        status: "Failed",
        message: "Fallo el registro de usuario",
    });
});

sessionRouter.get("/logout", async (req, res) => {
    req.session.destroy((e) => {
        if (e) {
            res.status(500).send({
                status: "Failed",
                message: "No se pudo cerrar la sesión",
                payload: error,
            });
        }
    });
    res.redirect("/login");
});

export default sessionRouter;
