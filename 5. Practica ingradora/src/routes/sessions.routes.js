import { Router } from "express";
import { validatePassword } from "../utils.js";
import passport from "passport";
import usersModel from "../dao/models/user.model.js"

const sessionRouter = Router();

sessionRouter.get('/github', passport.authenticate('github',{scope:['user:email']}),async(req,res)=>{})

sessionRouter.get('/githubcallback',passport.authenticate('github',{failureRedirect:'/login'}),async(req,res)=>{
    req.session.user = {
    name: req.user.first_name,
    email:'Private mail'
    };
    res.redirect('/products');
})

sessionRouter.get("/faillogin", (req, res) => {
    res.status(400).send({
        status: "Failed",
        message: "Fallo el logueo de usuario",
    });
});

sessionRouter.post(
    "/login",
    passport.authenticate("login", { failureRedirect: "/api/sessions/faillogin" }),
    async (req, res) => {
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

sessionRouter.get("/failregister", (req, res) => {
    res.status(400).send({
        status: "Failed",
        message: "Fallo el registro de usuario",
    });
});

sessionRouter.post(
    "/register",
    passport.authenticate("register", { failureRedirect: "/api/sessions/failregister" }),
        (req, res) => {
        res.send({
            status: "Sucess",
            message: "Usuario creado existosamente",
        });
    }
);

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

sessionRouter.get("/current", async (req, res) => {
    let user;
    try{
        if (req.user.email) {
            user = await usersModel.findOne({ email:req.user.email })
            user.password = null;
        }
        if (user) {
            res.status(200).send({
                status:"Sucess",
                payload: user
            })
        } else {
            res.status(400).send({
                status: "Failed",
                message: "No se encontró sesión de usuario iniciada"
            })
        }
    }
    catch( error ){
        res.status(500).send({
            status: "Failed",
            message: `Error al leer: ${error}`
        })
    }
});

export default sessionRouter;
