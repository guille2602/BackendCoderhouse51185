import { Router } from "express";
import chatView from "../views/chat.view.js";

const router = Router();

router.get("/", chatView.renderChat);

export default router;