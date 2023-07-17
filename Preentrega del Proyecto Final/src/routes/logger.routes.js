import { Router } from "express";

const router = Router();

router.get("/", (req, res) =>{
    console.log(req.logger)
    req.logger.debug("debug test")
    req.logger.http("http test")
    req.logger.info("info test")
    req.logger.warning("warning test")
    req.logger.error("error test")
    req.logger.fatal("fatal test")
    res.send("This is a test");
});

export default router;