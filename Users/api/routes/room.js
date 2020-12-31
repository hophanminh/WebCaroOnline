const express = require("express");
require('express-async-errors');

const router = express.Router();
const model = require('../utils/sql_command');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');


/* GET users listing. */
router.get('/online', async (req, res) => {
  const data = await model.getOnlineRoomList();
  res.send(data);
});


module.exports = router;
