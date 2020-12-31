const express = require('express');
const router = express.Router();
const config = require("../config/default-config.json");
const model = require("../utils/sql-query");

/* GET PROFILE. */
router.get('/', async function (req, res, next) {
  const user = await model.getUserByID(req.user.user[0].ID);
  res.send(user);
});

router.post("/updateInformation", async (req, res) => {
  const user = req.user.user[0];
  const input = req.user.input;
  if (user.email !== input.newEmail) {
    const sameEmail = await model.getUserByEmail(input.newEmail);
    if (sameEmail.length > 0) {
      return res.status(400).send({
        message: "Email existed."
      })
    }
  }
  if (user.username !== input.newUsername) {
    const sameUsername = await model.getUserByUsername(input.newUsername);
    if (sameUsername.length > 0) {
      return res.status(400).send({
        message: "Username exited."
      })
    }
  }

  user.username = input.newUsername;
  user.fullname = input.newFullname;
  user.email = input.newEmail;

  const updateInfor = await model.updateUser(user);
  console.log("User has updated: " + updateInfor);
  res.status(200).send({
    message: "Update information successfully."
  })
})

router.post("/updatePassword", async (req, res) => {
  const user = req.user.user[0];
  const input = req.user.input;
  // check same old password
  if (bcrypt.compareSync(input.oldPass, user.password)) {
    const hash = bcrypt.hashSync(input.newPass, config.saltBcryptjs);
    user.password = hash;
    await model.updateUser(user);
    res.sendStatus(200)
  }
  else {
    res.status(401).send({
      message: 'Old password is incorrect!'
    });
  }
})

router.get("/users", async (req, res) => {

})

router.post("/users/:email", async (req, res) => {

})

router.get("/users/:userId", async (req, res) => {

})

router.post("/users/:id/ban", async (req, res) => {

})

router.get("/matches", async (req, res) => {

})

router.get("/matches/:uuidMatch", async (req, res) => {

})

router.post('/finish/list', async (req, res) => {
  const userID = req.user.input.userID;
  const data = await model.getFinishRoomListByUserID(userID);
  res.send(data);
});

router.post('/finish/message', async (req, res) => {
  const roomID = req.user.input.roomID;
  const data = await model.getMessageByRoomID(roomID);
  res.send(data);
});

router.post('/finish/room', async (req, res) => {
  const roomID = req.user.input.roomID;
  const { data, gameData } = await getRoomInfo(roomID);
  res.send({ data, gameData });
});

const getRoomInfo = async (id) => {
  if (id != null) {
    const data = await model.getRoomByID(id);
    const moves = await model.getMoveByRoomID(id);
    const gameData = transformGameData(moves);
    return { data, gameData };
  }
}

const transformGameData = (moves) => {
  const row = config.row;
  const column = config.column;
  let history = [{
    squares: Array(column * row).fill(null),
    move: -1,
  }];
  stepNumber = 0;
  xIsNext = true;

  if (moves && moves !== undefined && moves.length != 0) {
    stepNumber = moves.length;
    xIsNext = (moves.length % 2) === 0 ? true : false;

    const squares = Array(column * row).fill(null);
    for (let i = 0; i < moves.length; i++) {
      const pos = moves[i].position;
      const turn = i + 1;
      const current = (turn % 2) === 0 ? 'O' : 'X';

      squares[pos] = current;
      history.push({
        squares: squares.slice(),
        move: pos,
      });
    }
  }
  return { history, stepNumber, xIsNext };
}

module.exports = router;
