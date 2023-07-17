import dotenv from 'dotenv';

dotenv.config();

export default {
    port: process.env.PORT,
    mongoUrl: process.env.MONGO_URL,
    adminMail: process.env.ADMIN_MAIL,
    adminPassword: process.env.ADMIN_PASSWORD,
    secret: process.env.SECRET,
    gmail: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS
    },
    envMode: process.env.ENV_MODE,
}