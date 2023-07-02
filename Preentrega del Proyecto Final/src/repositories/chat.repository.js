export class ChatRepository {

    constructor(dao){
        this.dao = dao;
    }

    async readChatlog(){
        try {
            const chatlog = await this.dao.find()
            return chatlog;
        } catch (error) {
            console.log("Error al acceder al log de chats: " + error)
        }
    }

}