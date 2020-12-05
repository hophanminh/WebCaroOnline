const model = require('../utils/sql_command');
require('express-async-errors');

module.exports = function (io) {
  io.on("connection", socket => {

    // disconnect is fired when a client leaves the server
    socket.on("disconnect", () => {
      console.log("user disconnected");
    });
  });
}
