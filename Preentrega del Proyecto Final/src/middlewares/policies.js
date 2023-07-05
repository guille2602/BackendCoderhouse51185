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
    const user = await userService.getUser({email:req.user.email});
    if ( req.params.cid.toString() !== user.cart._id.toString()){
        return res.status(403).send({
            status: "Failed",
            message:`Los usuarios solo pueden acceder a su propio carrito: ${user.cart._id === req.params.cid}`
        })
    }
    next();
}