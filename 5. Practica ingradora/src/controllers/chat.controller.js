import { request, response } from "express";
import messageModel from "../dao/models/messages.model.js";

class ChatView {

    async renderChat (req = request, res = response) {
        let  chatLog = await messageModel.find();
        chatLog = !chatLog && []; 
        res.render("chat", {
            css: "chat.css",
            chatLog,
        });
    }
    
}

export default new ChatView();