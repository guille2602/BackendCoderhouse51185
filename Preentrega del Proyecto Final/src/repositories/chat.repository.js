export class ChatRepository {

    constructor(dao){
        this.dao = dao;
    }

    async readChatlog(req){
        try {
            const chatlog = await this.dao.find()
            return chatlog;
        } catch (error) {
            req.logger.error(`Error al acceder al log de chats: ${error}`)
        }
    }

}