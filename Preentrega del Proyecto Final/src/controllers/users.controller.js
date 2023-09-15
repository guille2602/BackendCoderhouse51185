import { userService, cartsService } from "../repositories/index.js";
import transport from "../config/gmail.js";
import {
    validatePassword,
    createHash,
    verifyEmailToken,
    generateEmailToken,
} from "../utils.js";
import userDTO, { minUserDTO } from "../dao/dto/user.dto.js";
import { sendRecoveryLink } from "../config/gmail.js";
import userModel from "../dao/models/user.model.js";

class SessionController {

    async getAllUsers(req, res) {
        const users = await userService.getAllUsers();
        if (users.length > 0) {
            const dtoUsersList = users.map((user) => {
                user = new minUserDTO(user);
                return user;
            });
            return res.status(200).send({
                status: "success",
                payload: dtoUsersList
            });
        }
        return res.status(200).send({
            status: "success",
            payload: []
        });
    }

    async gitHubLogin(req, res) {
        req.session.user = {
            name: req.user.first_name,
            email: req.user.email,
        };
        res.redirect("/products");
    }

    failedLogin(req, res) {
        res.status(400).send({
            status: "failed",
            message: "Falló el logueo de usuario",
        });
    }

    async login(req, res) {
        if (!req.user) {
            res.status(400).send({
                status: "success",
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
            req.logger.info("Se ha logueado un administrador");
        } else {
            req.session.admin = false;
        }
        const user = await userModel.findOne({ email: req.user.email });
        user.last_connection = new Date();
        await userModel.updateOne({ email: req.user.email }, user);

        res.status(200).send({
            status: "success",
            message: "Logueado correctamente",
            payload: req.res.user,
        });
    }

    failedRegister(req, res) {
        res.status(400).send({
            status: "failed",
            message: "Fallo el registro de usuario",
        });
    }

    sucessRegister(req, res) {
        res.send({
            status: "success",
            message: "Usuario creado existosamente",
        });
    }

    async logout(req, res) {
        const userEmail = JSON.parse(JSON.stringify(req.user.email));
        req.session.destroy((e) => {
            if (e) {
                res.status(500).send({
                    status: "failed",
                    message: "No se pudo cerrar la sesión",
                    payload: error,
                });
            }
        });
        const user = await userModel.findOne({ email: userEmail });
        user.last_connection = new Date();
        await userModel.updateOne({ email: userEmail }, user);
        res.redirect("/login");
    }

    async currentUser(req, res) {
        let user;
        try {
            if (req.user?.email) {
                user = await userService.getUser({ email: req.user.email });
                user = new userDTO(user);
            }
            if (user) {
                res.status(200).send({
                    status: "success",
                    payload: user,
                });
            } else {
                res.status(400).send({
                    status: "failed",
                    message: "No se encontró sesión de usuario iniciada",
                });
            }
        } catch (error) {
            res.status(500).send({
                status: "failed",
                message: `Error al leer: ${error}`,
            });
        }
    }

    async changeRole(req, res, next) {
        try {
            const user = await userService.getUserById({ _id: req.params.uid });
            if (user.role === "user") {
                user.role = "premium";
            } else if (user.role === "premium") {
                user.role = "user";
            } else if (user.role === "admin")
                { return res.json({
                    status: "failed",
                    message: "Admin can't change role"
                })
                } else 
                return res.json({
                    status: "error",
                    message: "User role not changed",
                });
            await userService.updateUser(user);
            return res.json({
                status: "success",
                message: "Role has been changed",
            });
        } catch (error) {
            next(error);
        }
    }

    async updateUser(req, res, next) {
        try {
            const uId = req.params.uid;
            const user = await userModel.findById(uId);
            const identificacion = req.files["identificacion"]?.[0] || null;
            const domicilio = req.files["domicilio"]?.[0] || null;
            const estadoDeCuenta = req.files["estadoDeCuenta"]?.[0] || null;
            const docs = [];
            if (identificacion) {
                docs.push({
                    name: "identificacion",
                    reference: identificacion.filename,
                });
            }
            if (domicilio) {
                docs.push({
                    name: "domicilio",
                    reference: domicilio.filename,
                });
            }
            if (estadoDeCuenta) {
                docs.push({
                    name: "estadoDeCuenta",
                    reference: estadoDeCuenta.filename,
                });
            }
            if (docs.length === 3) {
                user.status = "completo";
            } else {
                user.status = "incompleto";
            }
            user.documents = docs;
            await userModel.findByIdAndUpdate(user._id, user);
            res.status(200).json({
                status: "success",
                message: "Documentos actualizados correctamente",
            });
        } catch (error) {
            next(error);
        }
    }

    async passwordRecovery(req, res) {
        try {
            const { email } = req.body;
            if (!email) {
                res.status(400).send({
                    status: "failed",
                    message: "No se ha recibido correo de usuario",
                });
            }
            const user = await userService.getUser({ email: email });
            if (!user) {
                res.send(
                    `<h2>Ha ocurrido un error </h2><a href="/forgot-password">Volver a intentar</a>`
                );
            }
            const token = generateEmailToken(email, 60 * 60);
            await sendRecoveryLink(email, token);
            res.send(
                `<h2>Se ha enviado un correo a su casilla para cambiar la contraseña.</h2><a href="/login">Volver</a>`
            );
        } catch (error) {
            next(error);
        }
    }

    async resetPassword(req, res, next) {
        try {
            const token = req.query.token;
            const { email, newPassword } = req.body;
            const validEmail = verifyEmailToken(token);
            if (!validEmail) {
                return res.send(
                    `<h2>El enlace ha expirado, por favor genere uno nuevo</h2><a href="/forgot-password">Volver a generar</a>`
                );
            }
            const user = await userService.getUser({ email: email });
            if (!user) {
                return res.send("No usuario no está registrado");
            }
            if (validatePassword(user, newPassword)) {
                return res.send(
                    `<h2>La contraseña no puede ser identica a la anterior</h2>`
                );
            }
            const userData = {...user};
            userData.password = createHash(newPassword);
            const result = await userService.updateUser(userData);
            res.redirect("/login?message=PasswordSuccessfullyUpdated");
        } catch (error) {
            next(error);
        }
    }

    async deleteInactiveUsers(req, res, next){
        try{
        const users = await userService.getAllUsers();
        const today = new Date();
        const filteredUsersList = users.filter((user)=>{
            const lastConnection = user.last_connection? new Date(user.last_connection) : null;
            let timeSinceLastConnection = null;
            if ( lastConnection ) {
                timeSinceLastConnection = (today - lastConnection) / (1000*60*60*24)
            }
            return timeSinceLastConnection > 2 || timeSinceLastConnection === null;
        })

        const htmlContent = `
            <h1>Su cuenta ha sido eliminada por inactividad</h1>
            <p>
            Le informamos que su cuenta ha sido eliminada por inactividad mayor a 2 días.
            </p>
            `

        filteredUsersList.forEach((user) => {
            userService.deleteUserById(user._id)
            transport.sendMail({
                from: 'CoderBackend 51185 ecommerce',
                to: user.email,
                subject:'Cuenta eliminada',
                html: htmlContent
            })
        })

        res.status(200).send({
            status: "success",
            payload: filteredUsersList
        })} 
        catch(error){
            next(error);
        }
    }

    async deleteUser ( req, res, next ) {
        const uid = req.params.uid;
        try {
            const user = await userService.getUser({ _id:uid })
            const cid = user._id;
            const result = await userService.deleteUserById(uid);
            if (result.deletedCount == 1) {
            if (user) {cartsService.deleteCart({ _id: cid })}
            return res.status(200).send({
                status: 'success',
                payload: result,
            })
            } else {
                return res.status(200).send({
                    status: 'failed',
                })
            }
        } catch (error) {
            next(error)
        }
    }

}
export default new SessionController();
