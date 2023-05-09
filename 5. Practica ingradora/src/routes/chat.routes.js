import { Router } from "express";
import messageModel from "../dao/models/messages.model.js";
import { io } from "../app.js";

const router = Router();

router.get("/", async (req, res) => {

    let  chatLog = await messageModel.find();
    chatLog = !chatLog && []; 

    res.render("chat", {
        css: "chat.css",
        chatLog,
    });
});

export default router;