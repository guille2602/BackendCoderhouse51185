import { EErrors } from "../services/errors/enums.js";

const errorHandler = ( error, req , res , next ) => {
    switch (error.code) {
        case EErrors.INVALID_JSON:
            res.json({status:"error", error: error.cause, message: error.message})
             break;
        case EErrors.DATABASE_ERROR:
            res.json({status:"error", error: error.cause, message: error.message})
            break;
        case EErrors.AUTH_ERROR:
            res.json({status:"error", error: error.cause, message: error.message})
            break;
        case EErrors.INVALID_TYPES_ERROR:
            res.json({status:"error", error: error.cause, message: error.message})
            break;
        case EErrors.ROUNTING_ERROR:
            res.json({status:"error", error: error.cause, message: error.message})
            break;
        default:
            res.json({status:"error", message: "Se ha producido un error, contacte a un administrador"})
            break;
    }
    next();
}

export default errorHandler;