export default class DTOuser{
    constructor(user){
        this.firstName = user.first_name
        this.lastName = user.last_name
        this.rol = user.rol
    }
}