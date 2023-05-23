import { Router } from "express";
import userModel from "../dao/models/user.model.js";

const sessionRouter = Router();

sessionRouter.post('/login', async ( req , res) => {

    const { email, password } = req.body;

    try {

    const payload = await userModel.findOne({ email, password });
    console.log(payload);
    if ( !payload ) {
        res.status(400).send({
            status: "Failed",
            message: "Alguno de los datos ingresados es incorrecto, revise los datos"
        })
    } 

    req.session.user = {
        name: `${payload.firstName} ${payload.lastName}`,
        email
    }
    if (email == "adminCoder@coder.com"){
        req.session.admin = true;
    } else {
        req.session.admin = false;
    }

    res.status(200).send({
        status: "Sucess",
        message: "Logueado correctamente",
        payload: req.res.user,
    })
} catch (error) {
    console.log(error);
}

})

sessionRouter.post('/register', async ( req , res ) => {
    
    const { firstName, lastName, email, age, password } = req.body;

    if (!firstName || !lastName || !email || !password) {
        res.status(400).send({
            status: "Failed",
            message: "Error al actualizar, datos incompletos"
        })
    }

    const alreadyExists = await userModel.findOne({ email:email })
    if (alreadyExists) {
        res.status(400).send({
            status: "Failed",
            message: "El correo ya se encuentra registrado"
        })
    }

    const user = { firstName, lastName, email, age, password }

    const payload = await userModel.create( user );

    res.send ({
        status: "Sucess",
        message: "Usuario creado existosamente",
        payload
    })

})

sessionRouter.get('/logout', async ( req , res ) => {

    req.session.destroy( e => {
        if (e) {
            res.status(500).send({
                status: "Failed",
                message: "No se pudo cerrar la sesión",
                payload: error
            })
        }
    });
    res.redirect("/login")
})

export default sessionRouter;