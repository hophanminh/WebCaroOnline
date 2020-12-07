const passport = require("passport")
const passportJWT = require("passport-jwt");
const extractJWT = passportJWT.ExtractJwt;
require("express-async-errors");
const bcrypt = require('bcrypt');
const JWTStrategy = passportJWT.Strategy;
const LocalStrategy = require("passport-local").Strategy;
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
    secretOrKey: config["secret-key"],
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
