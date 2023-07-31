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

export const sendRecoveryLink = async ( email, token) => {
    const link=`http://localhost:8080/reset-password?token=${token}`
    await transport.sendMail({
        from: config.gmail.user,
        to: email,
        subject: "Restablecer contraseña",
        html: `
            <div>
                <h2>Has solicitado un cambio de contraseña, clickea el siguiente link para restablecer:</h2>
                <a href="${link}"><button>Restablecer contraseña</button></a>
            </div>
        `
    })
}