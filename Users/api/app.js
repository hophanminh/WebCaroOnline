const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require("body-parser");
const logger = require('morgan');
const cors = require('cors');
const passport = require('passport');
const http = require("http");
const socketIO = require('socket.io');
const config = require("./config/default.json");
require('express-async-errors');
require('./utils/passport');

const URL =  config.HOST.CURRENT;
//const URL = /caroonline-user.herokuapp\.com$/;

const corsOptions = {
  // test
  origin: [/caroonline-user.herokuapp\.com$/, "http://localhost:3000"]
};


const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: [/caroonline-user.herokuapp\.com$/, "http://localhost:3000"],
    methods: ["GET", "POST"]
  }
});

const ioConfig = require('./utils/server')(io);
app.use(cors())

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// dependency
app.use(cors(corsOptions));

app.use(logger('dev'));
app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// router
const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');
const userRouter = require('./routes/user');
const roomRouter = require('./routes/room');

app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/room', roomRouter);
app.use('/user', passport.authenticate('jwt', { session: false }), userRouter);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

server.listen(process.env.PORT || 9000, () => {
  console.log("server running at port 9000");
});

module.exports = io;