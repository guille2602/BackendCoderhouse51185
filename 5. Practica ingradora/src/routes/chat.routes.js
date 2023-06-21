import { Router } from "express";
import chatView from '../controllers/chat.controller.js'

const router = Router();

router.get("/", chatView.renderChat);

export default router;