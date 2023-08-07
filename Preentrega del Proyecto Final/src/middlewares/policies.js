import { userService } from "../repositories/index.js"

export const onlyAdminAuth = ( req , res , next ) => {
    if(!req.session.admin) return res.status(403).send({
        status: "Failed",
        message:"Se requieren permisos de administrador"
    })
    next();
}

export const onlyuserAuth = ( req , res , next ) => {
    if(req.session.admin) return res.status(403).send({
        status: "Failed",
        message:"Acceso autorizado solo a usuarios"
    })
    next();
}

export const validateUser = async ( req , res , next) => {
    let user
    if (req.user){
        user = await userService.getUser({email:req.user.email});
    } else return res.status(401).json({
        status: "failed",
        message: "No se encuentra logueado"
    })
    if ( req.params.cid.toString() !== user.cart._id.toString()){
        return res.status(403).send({
            status: "failed",
            message:`Los usuarios solo pueden acceder a su propio carrito`
        })
    }
    next();
}