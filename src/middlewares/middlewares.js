import DTOuser from "../DTO/user.dto.js"

export const rolAuthenticationAdmin = async(req, res, next) => {
    if(!req.session.login){
        return res.redirect("/login")
    }
    const DTOusers = new DTOuser(req.session.user)
    if(DTOusers.rol == "Admin" || DTOusers.rol == "Premium"){
        return next()
    }
    return res.redirect("profile")
}

export const rolAuthenticationUser = async(req, res, next) => {
    if(!req.session.login){
        return res.redirect("/login")
    }
    const DTOusers = new DTOuser(req.session.user)
    if(DTOusers.rol == "User" || DTOusers.rol == "Premium" ){
        return next()
    }
    return res.redirect("profile")
}