import { EErrors } from "../services/errors/enums.js";

const errorHandler = ( error, req , res , next ) => {
    switch (error.code) {
        case EErrors.ROUNTING_ERROR:
            res.json({status:"error", message: error.message})
            break;
        case EErrors.DATABASE_ERROR:
            res.status(500).json({status:"error", message: error.message})
            break;
        case EErrors.INVALID_JSON:
            res.status(400).json({status:"error", message: error.message})
            break;
        case EErrors.AUTH_ERROR:
            res.json({status:"error", message: error.message})
            break;
        case EErrors.INVALID_PARAM:
            res.status(400).json({status:"error", message: error.message})
            break;
        default:
            res.json({status:"error", message: error.message})
            break;
    }
    next();
}

export default errorHandler;