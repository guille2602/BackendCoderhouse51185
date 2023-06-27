import usersModel from "../dao/models/user.model.js";
import { validatePassword } from '../utils.js'

class SessionController {
    async gitHubLogin(req, res) {
        req.session.user = {
            name: req.user.first_name,
            email: req.user.email,
        };
        res.redirect("/products");
    }

    failedLogin(req, res) {
        res.status(400).send({
            status: "Failed",
            message: "Fallo el logueo de usuario",
        });
    }

    async login(req, res) {
        if (!req.user) {
            res.status(400).send({
                status: "Sucess",
                message: "Credenciales inválidas",
            });
            return;
        }
        req.session.user = {
            name: `${req.user.first_name} ${req.user.last_name}`,
            email: req.user.email,
            age: req.user.age,
        };
        const isCoderPass = validatePassword(req.user, "adminCod3r123");
        if (req.user.email == "adminCoder@coder.com" && isCoderPass) {
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

    failedRegister(req, res) {
        res.status(400).send({
            status: "Failed",
            message: "Fallo el registro de usuario",
        });
    }

    sucessRegister(req, res) {
        res.send({
            status: "Sucess",
            message: "Usuario creado existosamente",
        });
    }

    async logout(req, res) {
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
    }

    async currentUser (req, res) {
        let user;
        try {
            if (req.user?.email) {
                user = await usersModel.findOne({ email: req.user.email });
                user.password = null;
            }
            if (user) {
                res.status(200).send({
                    status: "Sucess",
                    payload: user,
                });
            } else {
                res.status(400).send({
                    status: "Failed",
                    message: "No se encontró sesión de usuario iniciada",
                });
            }
        } catch (error) {
            res.status(500).send({
                status: "Failed",
                message: `Error al leer: ${error}`,
            });
        }
    }

}

export default new SessionController();
