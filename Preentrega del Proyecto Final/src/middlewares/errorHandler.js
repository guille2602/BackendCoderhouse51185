import { EErrors } from "../services/errors/enums.js";

const errorHandler = ( error, req , res , next ) => {
    switch (error.code) {
        case EErrors.ROUNTING_ERROR:
            return res.json({status:"error", message: error.message})
        case EErrors.DATABASE_ERROR:
            return res.status(500).json({status:"error", message: error.message})
        case EErrors.INVALID_JSON:
            return res.status(400).json({status:"error", message: error.message})
        case EErrors.AUTH_ERROR:
            return res.json({status:"error", message: error.message})
        case EErrors.INVALID_PARAM:
            return res.status(400).json({status:"error", message: error.message})
        default:
            return res.json({status:"error", message: error.message})
    }
    next();
}

export default errorHandler;