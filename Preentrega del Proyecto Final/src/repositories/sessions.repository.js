export class SessionsRepository{

    constructor(dao){
        this.dao = dao;
    }

    async getUser(email){
        try {
            const user = this.dao.findOne(email);
            return user;
        } catch (error) {
            console.log("Error al leer el usuario: " + error)
        }
    }

}