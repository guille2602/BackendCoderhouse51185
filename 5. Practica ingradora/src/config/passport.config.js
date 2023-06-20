import passport from "passport";
import local from "passport-local";
import userModel from "../dao/models/user.model.js";
import { createHash, validatePassword } from "../utils.js";
import GitHubStrategy from 'passport-github2';
import cartsModel from "../dao/models/carts.model.js";
import config from './config.js';

const LocalStrategy = local.Strategy;

const initializePassport = () => {

    passport.use('github', new GitHubStrategy({
        clientID:'Iv1.944626d6ebace959',
        clientSecret:'96c743c154b278d890fcce8473d4bdf4825f9257',
        callbackURL:'http://localhost:8080/api/sessions/githubcallback'
    }, async (accessToken, refreshToken, profile, done) => {
        try{
            let email = profile._json.email || profile._json.login; 
            let user = await userModel.findOne({email:email})
            if (!user) {
                let newUser = {
                    first_name:profile._json.name,
                    last_name:' ',
                    age:18,
                    email:profile._json.email || profile._json.login,
                    password:'',
                }
                const emptyCart = { 
                    products: [] 
                }
                const newCart = await cartsModel.create( emptyCart )
                if (newCart) {
                    newUser.cart = newCart._id;
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
                const { first_name, last_name, email, age } = req.body;
                try {
                    let user = await userModel.findOne({ email: username });
                    if (user) {
                        console.log("El usuario ya existe");
                        return done(null, false);
                    }
                    let role;
                    if ( email == config.adminMail && password == "config.adminPassword") {
                        role = "admin";
                    }
                    const newUser = {
                        first_name,
                        last_name,
                        email,
                        age,
                        password: createHash( password ),
                        role
                    };
                    const emptyCart = { 
                        products: [] 
                    }
                    const newCart = await cartsModel.create( emptyCart )
                    if (newCart) {
                        newUser.cart = newCart._id;
                    }
                    const result = await userModel.create( newUser );
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
