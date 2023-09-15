export class SessionsRepository{

    constructor(dao){
        this.dao = dao;
    }

    async getUser(email){
        try {
            const user = this.dao.findOne(email).lean();
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

    async deleteUserById(id){
        try {
            const deletedUser = this.dao.deleteOne({_id: id})
            return deletedUser;
        } catch (error) {
            console.log("Error al eliminar el usuario: " + error)
        }
    }

    async getAllUsers() {
        try {
            const usersList = this.dao.find().lean();
            return usersList;
        } catch (error){
            console.log("Error al leer la base de datos de MongoDB")
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