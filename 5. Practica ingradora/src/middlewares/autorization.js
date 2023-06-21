export const publicAccess = ( req , res , next ) => {
    if(req.session.user) return res.redirect('/profile');
    next();
}

export const privateAccess = ( req , res , next ) => {
    if(!req.session.user) return res.redirect('/login');
    next();
}