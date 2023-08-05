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