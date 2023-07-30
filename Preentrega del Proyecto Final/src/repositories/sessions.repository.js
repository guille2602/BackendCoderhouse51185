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

    async getUserById(_id){
        try {
            const user = this.dao.findOne(_id);
            return user;
        } catch (error) {
            console.log("Error al leer el usuario: " + error)
        }
    }

    async updateUser(user){
        try {
            result = await this.dao.updateOne({_id: user._id}, user)
            return {
                status:"sucess",
                result
            }
                ;
        } catch (error) {
            return({
                status:"failed",
            })
        }
    }  

}