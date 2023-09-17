import userModel from "../dao/models/user.model.js";

export const publicAccess = ( req , res , next ) => {
    if(req.session.user) return res.redirect('/profile');
    next();
}

export const privateAccess = ( req , res , next ) => {
    if(!req.session.user) return res.redirect('/login');
    next();
}

//In roles need to pass authorized roles to proceed.

export const checkRole = ( roles ) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.json({
                status:"error",
                message: "Not authorized"
            })
        }
        if (!roles.includes(req.user.role)){
            return res.status(401).json({
                status: "error",
                message: "Not authorized role"
            })
        } 
        next();
    }
}

export const checkAuth = ( req, res, next) => {
    if (req.user){
        next();
    } else {
        return res.status(401).json({
            status: "error",
            message: "Not autenticated"
        })
    }
}

export const checkStatus = async (req, res, next) => {
    const user = await userModel.findOne({_id:req.params.uid});
    req.email = user.email;
    if (user.status === "completo" || user.role === "premium") next();
    else return res.status(400).json({
        status: "failed",
        message: "El usuario debe adjuntar toda la documentación para aumentar su rango a premium"
    })
}

export const checkUserAuth = async ( req, res, next) => {
    if (!req.user) return res.status(401).send({
        status: "error",
        message: "Not autenticated"
    })
    const loggedUser = await userModel.findOne({email: req.user.email})
    if (!loggedUser) return res.status(400).json({
        status: "failed",
        message: "Bad request"
    })
    if (req.user.email === loggedUser.email){
        next();
    } else {
        return res.status(403).json({
            status: "error",
            message: "Not autorized"
        })
    }
}