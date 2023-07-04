import nodemailer from "nodemailer";
import config from "./config.js";

const transport = nodemailer.createTransport({
    service: 'gmail',
    port: 587,
    auth: {
        user:config.gmail.user,
        pass:config.gmail.pass 
    },
    secure: false,
    tls:{
        rejectUnauthorized: false
    }
})

export default transport;