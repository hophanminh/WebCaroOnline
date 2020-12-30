const passport = require('passport')
const passportJWT = require("passport-jwt");
const ExtractJWT = passportJWT.ExtractJwt;
require('express-async-errors');
const bcrypt = require('bcrypt');
const cryptoRandomString = require('crypto-random-string');
const nodemailer = require("nodemailer");
const MailTemplate = require("../utils/mailTemplate");

const JWTStrategy = passportJWT.Strategy;
const LocalStrategy = require('passport-local').Strategy;
const model = require('./sql_command');
const config = require("../config/default.json");

passport.use(new LocalStrategy(
    async (username, password, done) => {
        const user = await model.getUserByUsername(username);
        if (user && user !== undefined && user.length != 0) {
            const res = bcrypt.compareSync(password, user[0].password);
            if (res) {
                if (res.status === config.status.INACTIVE) {
                    return done(null, false, { message: 'Account is inactive. Please verify it in your email.'});
                }
                else {
                    return done(null, user, { message: 'Logged In Successfully' });
                }
            }
        }
        return done(null, false, { message: 'Incorrect username or password.' });

    })
);

passport.use('local-signup', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
},
    async (req, username, password, done) => {
        const email = req.body.email;
        const fullname = req.body.fullname;
        const user = await model.getUserByNameOrEmail({ username, email })
        if (user && user !== undefined && user.length != 0) {
            return done(null, false, { message: 'That email or username is already taken.' });
        }
        const hash = bcrypt.hashSync(password, 10);
        const newU = await model.register([username, hash, email, fullname]);

        const hashLink = cryptoRandomString({ length: 40, type: 'base64' });
        await model.saveHashLinkToActiveUser(newU.insertId, hashLink);
        MailTemplate.activeAccountMail(hashLink, email);

        const newUser = await model.getUserByEmail(email);
        return done(null, newUser);
    }
));

passport.use(new JWTStrategy({
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: 'your_jwt_secret',
    passReqToCallback: true
},
    async (req, jwtPayload, done) => {
        const input = req.body;
        user = await model.getUserByID(jwtPayload[0].ID)
        if (user) {
            const entity = { user, input };                    //entity[0]: user, entity[1]: input
            return done(null, entity);
        }
    }
));