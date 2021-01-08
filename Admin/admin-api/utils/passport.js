const passport = require("passport")
const passportJWT = require("passport-jwt");
const extractJWT = passportJWT.ExtractJwt;
require("express-async-errors");
const bcrypt = require('bcrypt');
const JWTStrategy = passportJWT.Strategy;
const LocalStrategy = require("passport-local").Strategy;

const FacebookStrategy = require("passport-facebook").Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const model = require("./sql-query");
const config = require("../config/default-config.json");

passport.use(new LocalStrategy(
    async (username, password, done) => {
        const user = await model.getUserByUsername(username);
        if(user && user !== undefined && user.length != 0) {
            const res = bcrypt.compareSync(password, user[0].password);
            if (res) {
                return done(null, user, {message: "Logged in successfully"});
            }
        }
            return done(null, false, {message: "Incorrect username or password."});
    }
));

passport.use("local-signup", new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
},
    async (req, username, password, done) => {
        const email = req.body.email;
        const fullname = req.body.fullname;
        const user = await model.getUserByNameOrEmail({username, email});
        if(user & user !== undefined && user.length != 0){
            return done(null, false, {message: "That email or username is invalid"})
        }
        const hash = bcrypt.hashSync(password, config.saltBcryptjs);
        const newUser = await model.register([username, hash, email, fullname]);
        const result = await model.getUserByEmail(email);
        return done(null, result);
    }
));

passport.use(new JWTStrategy({
    jwtFromRequest: extractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: config["SECRET-KEY"],
    passReqToCallback: true

},
    async (req, jwtPayload, done) => {
        const input = req.body;
        user = await model.getUserByID(jwtPayload[0].ID)
        if (user) {
            const entity = { user, input };                    //entity[0]: user, entity[1]: input
            return done(null, entity);
        }
}))


passport.use(new FacebookStrategy({
        clientID: "3854315697953129",
        clientSecret: "7d0b726582a352bf6f3598ddda08d3db",
        callbackURL: `${config.API.LOCAL}/auth/facebook/callback`,
        profileFields: ['id', 'emails', 'name'],
    },
    async (accessToken, refreshToken, profile, done) => {
        const { id, email, first_name, last_name } = profile._json;
        const createdEmail = email ? email : id + "@facebook.com";
        const fullName = first_name + " " + last_name;

        const user = await model.getUserByNameOrEmail(id, createdEmail);
        console.log()
        if (user && user !== undefined && user.length != 0) {
            return done(null, user);
        }
        else {
            const newU = await model.register([id, null, createdEmail, fullName]);
            const newUser = await model.getUserByUsername(id);
            return done(null, newUser);
        }
    }
));

passport.use(new GoogleStrategy({
        clientID: "1014269270892-beli4unjkq6g9m75p8icinq3t3qniv6v.apps.googleusercontent.com",
        clientSecret: "OMMbmN6zI4XbYVLuXzNpEzpE",
        callbackURL: `${config.API.LOCAL}/auth/google/callback`
    },
    async (accessToken, refreshToken, profile, done) => {
        console.log(profile);

        const { sub, email, name } = profile._json;

        const createdEmail = email ? email : sub + "@gmail.com";
        const user = await model.getUserByNameOrEmail(sub, email);

        if (user && user !== undefined && user.length != 0) {
            return done(null, user);
        }
        else {
            const newU = await model.register([sub, null, email, name]);
            const newUser = await model.getUserByUsername(sub);
            return done(null, newUser);
        }

    }

));

