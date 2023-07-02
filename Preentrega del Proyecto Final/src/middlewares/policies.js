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
    const user = await userService.getUser(req.session.email);

    //Se llama a "cart" si se pide desde el front agregar productos al carrito
    if (req.params.cid === "cart" && user) {
        req.params.cid = user.cart._id
    }
    
    if ( req.params.cid !== user?.cart?._id){
        return res.status(403).send({
            status: "Failed",
            message:"Los usuarios solo pueden acceder a su propio carrito"
        })
    }
    next();
}