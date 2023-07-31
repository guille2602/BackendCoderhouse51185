import { userService } from '../repositories/index.js';
import { validatePassword, createHash, verifyEmailToken, generateEmailToken } from '../utils.js';
import userDTO from '../dao/dto/user.dto.js';
import { sendRecoveryLink } from '../config/gmail.js';

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
            message: "Falló el logueo de usuario",
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
            req.logger.info("Se ha logueado un administrador")
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
                user = await userService.getUser({ email: req.user.email });
                user = new userDTO(user);
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

    async changeRole ( req , res, next ) {
        try {
            const user = await userService.getUserById({_id: req.params.uid});
            if (user.role === "user"){
                user.role = "premium";
            } else if (user.role ==="premium"){
                user.role = "user";
            } else {
                return res.json({
                    status: "error",
                    message: "User role not changed"
                })
            }
            await userService.updateUser(user);
            return res.json({
                status:"sucess",
                message:"Role has been changed"
            })
        } catch (error) {
            next(error);
        }
    }

    async passwordRecovery (req, res) {
        try {
            const { email } = req.body;
            if (!email){
                res.status(400).send({
                    status:"failed",
                    message: "No se ha recibido correo de usuario"
                })
            }
            const user = await userService.getUser({ email: email});
            if (!user){
                res.send(`<h2>Ha ocurrido un error </h2><a href="/forgot-password">Volver a intentar</a>`)
            }
            const token = generateEmailToken(email,60*60)
            await sendRecoveryLink(email, token)
            res.send(`<h2>Se ha enviado un correo a su casilla para cambiar la contraseña.</h2><a href="/login">Volver</a>`)

        } catch (error) {
            next(error);
        }
    }

    async resetPassword (req, res, next) {
        try {
            const token = req.query.token;
            const { email, newPassword } = req.body;
            const validEmail = verifyEmailToken(token)
            if (!validEmail){
                return res.send(`<h2>El enlace ha expirado, por favor genere uno nuevo</h2><a href="/forgot-password">Volver a generar</a>`)
            }
            const user = await userService.getUser({email:email})
            if (!user){
                return res.send("No usuario no está registrado")
            }
            if (validatePassword(user, newPassword)){
                return res.send(`<h2>La contraseña no puede ser identica a la anterior</h2>`)
            }
            const userData = {
                ...user._doc,
                password: createHash(newPassword) 
            };
            const result = await userService.updateUser(userData);
            res.redirect("/login?message=PasswordSuccessfullyUpdated")
        } catch (error) {
            console.log(error)
            next(error);
        }
    }

}


export default new SessionController();
