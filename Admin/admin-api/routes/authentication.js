const express = require("express");
const router = express.Router();
const jwt = require('jsonwebtoken');
const passport = require('passport');
const config = require("../config/default-config.json");
require('express-async-errors');

router.post("/signin", function (req, res, next) {
    passport.authenticate('local', { session: false }, (err, user, info) => {
        if (err || !user || user === undefined || user.length == 0) {
            return res.status(400).json({
                message: info.message,
                user: user
            });
        }
        req.login(user, { session: false }, (err) => {
            if (err) {
                res.send(err);
            }
            // generate a signed son web token with the contents of user object and return it in the response
            const token = jwt.sign(JSON.stringify(user), config["SECRET-KEY"]);
            return res.json({ID: user[0].ID, name: user[0].username, token: token });
        });
    })(req, res);
});

router.post("/register", function (req, res, next) {
    passport.authenticate('local-signup', { session: false }, (err, user, info) => {
        if (err || !user || user === undefined || user.length == 0) {
            return res.status(400).json({
                message: info.message,
                user: user
            });
        }
        req.login(user, { session: false }, (err) => {
            if (err) {
                res.send(err);
            }
            // generate a signed son web token with the contents of user object and return it in the response
            const token = jwt.sign(JSON.stringify(user), config["SECRET-KEY"]);
            return res.json({ID: user[0].ID, name: user[0].username, token: token });
        });
    })(req, res);
});

router.get("/facebook", passport.authenticate("facebook", { session: false, scope: ['email'] }));

router.get("/facebook/callback", function (req, res, next) {
    passport.authenticate("facebook", { session: false }, (err, user, info) => {
        if (err || !user || user === undefined || user.length == 0) {
            return res.status(400).json({
                message: "Unexpected Error",
                user: user
            });
        }
        req.login(user, { session: false }, (err) => {
            if (err) {
                res.send(err);
            }
            // generate a signed son web token with the contents of user object and return it in the response
            const token = jwt.sign(JSON.stringify(user), 'your_jwt_secret');
            return res.redirect(`${config.HOST.LOCAL}/Login/?id=${user[0].ID}&name=${user[0].username}&token=${token}`)
        });
    })(req, res);
});

router.get('/google', passport.authenticate('google', { session: false, scope: ['profile', 'email'] }));

router.get('/google/callback', function (req, res, next) {
    passport.authenticate('google', { session: false }, (err, user, info) => {
        if (err || !user || user === undefined || user.length == 0) {
            return res.status(400).json({
                message: "Unexpected Error",
                user: user
            });
        }
        req.login(user, { session: false }, (err) => {
            if (err) {
                res.send(err);
            }
            // generate a signed son web token with the contents of user object and return it in the response
            const token = jwt.sign(JSON.stringify(user), 'your_jwt_secret');
            return res.redirect(`${config.HOST.LOCAL}/Login/?id=${user[0].ID}&name=${user[0].username}&token=${token}`)
        });
    })(req, res);
});

module.exports = router;
