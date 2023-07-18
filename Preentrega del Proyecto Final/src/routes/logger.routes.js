import { Router } from "express";

const router = Router();

router.get("/", (req, res) =>{
    req.logger.debug(`debug test at ${new Date().toLocaleDateString()}, ${new Date().toLocaleTimeString()}`)
    req.logger.http(`http test at ${new Date().toLocaleDateString()}, ${new Date().toLocaleTimeString()}`)
    req.logger.info(`info test at ${new Date().toLocaleDateString()}, ${new Date().toLocaleTimeString()}`)
    req.logger.warning(`warning test at ${new Date().toLocaleDateString()}, ${new Date().toLocaleTimeString()}`)
    req.logger.error(`error test at ${new Date().toLocaleDateString()}, ${new Date().toLocaleTimeString()}`)
    req.logger.fatal(`fatal error test at ${new Date().toLocaleDateString()}, ${new Date().toLocaleTimeString()}`)
    res.send(`This is a test`);
});

export default router;