import { Router } from "express";
import chatView from "../controllers/chat.controller.js"
import { onlyuserAuth } from "../middlewares/policies.js"

const router = Router();

router.get("/", onlyuserAuth, chatView.renderChat);

export default router;