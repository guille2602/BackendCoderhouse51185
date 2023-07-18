import { request, response } from "express";
import { chatService } from "../repositories/index.js"

class ChatView {

    async renderChat (req = request, res = response) {
        let  chatLog = await chatService.readChatlog(req);
        chatLog = !chatLog && []; 
        res.render("chat", {
            css: "chat.css",
            chatLog,
        });
    }
    
}

export default new ChatView();