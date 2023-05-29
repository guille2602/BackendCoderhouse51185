import passport from "passport";
import local from "passport-local";
import userModel from "../dao/models/user.model.js";
import { createHash, validatePassword } from "../utils.js";
import GitHubStrategy from 'passport-github2';

const LocalStrategy = local.Strategy;

const initializePassport = () => {

    passport.use('github', new GitHubStrategy({
        clientID:'Iv1.944626d6ebace959',
        clientSecret:'96c743c154b278d890fcce8473d4bdf4825f9257',
        callbackURL:'http://localhost:8080/api/sessions/githubcallback'
    }, async (accessToken, refreshToken, profile, done) => {
        try{
            console.log(profile);
            let user = await userModel.findOne({email:profile._json.email})
            if (!user) {
                let newUser = {
                    firstName:profile._json.name,
                    lastName:' ',
                    age:18,
                    email:profile._json.email || "private email",
                    password:''
                }
                let result = await userModel.create(newUser);
                done (null,result)}
            else {
                done(null,user);
            }
        }
        catch(error){
            return done(error);
        }
    }
    ))

    passport.use(
        "register",
        new LocalStrategy(
            { passReqToCallback: true, usernameField: "email" },
            async (req, username, password, done) => {
                const { firstName, lastName, email, age } = req.body;
                try {
                    let user = await userModel.findOne({ email: username });
                    if (user) {
                        console.log("El usuario ya existe");
                        return done(null, false);
                    }
                    const newUser = {
                        firstName,
                        lastName,
                        email,
                        age,
                        password: createHash(password),
                    };

                    const result = await userModel.create(newUser);
                    return done(null, result);
                } catch (error) {
                    return done("Error en el registro de usuario" + error);
                }
            }
        )
    );

    passport.use(
        "login",
        new LocalStrategy(
            { usernameField: "email" },
            async ( username, password, done) => {
                try {
                    const user = await userModel.findOne({ email:username });
                    if (!user) {
                        console.log("Error: No se encontró el usuario");
                        return done(null, false);
                    }
                    const isValid = validatePassword(user, password);
                    if (!isValid) {
                        console.log("Error: Datos incorrectos");
                        return done(null, false);
                    }
                    return done(null, user);
                } catch (error) {
                    return done("Error al intentar ingresar: " + error);
                }
            }
        )
    );

    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser(async (id, done) => {
        const user = await userModel.findById(id);
        done(null, user);
    });
};

export default initializePassport;
