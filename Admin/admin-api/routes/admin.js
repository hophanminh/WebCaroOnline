const express = require('express');
const router = express.Router();
const config = require("../config/default-config.json");
const model = require("../utils/sql-query");

/* GET PROFILE. */
router.get('/', async function (req, res, next) {
  const user = await model.getUserByID(req.user.user[0].ID);
  console.log(user);
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

router.get("/users",async (req, res) => {
  const users = await model.getUsers();
  console.log(users);
  if (users.length === 0)
    res.send("No users to display");
  res.send(users);
})


router.post("/users/search", async (req, res) => {
  const search = req.user.input.search;
  const user = await model.getUserByNameOrEmail({search, search});
  if(user.length === 0)
    res.send("User is not found.")
  res.send(user);
})

router.get("/users/:userId", async (req,res) => {
  const ID = req.params.userId;
  const user = await model.getUserByID(ID);
  if (user.length === 0)
    return res.status(400).send("User is not found");
  return res.send(user);
})


router.post("/users/:id/ban", async (req, res) => {
  const ID = req.params.id;
  const user = await model.banUser(ID);
  console.log(user);
  res.status(200).send("Update user success");

})

router.get("/matches", async (req, res) => {

  const matches = await model.getMatches();
  if(matches.length === 0)
    res.send("No match to display");
  res.send(matches);
})

router.get("/matches/:uuidMatch", async (req,res ) => {
  const UUIDMatch = req.params.uuidMatch;
  const match = await model.getMatch(UUIDMatch);
  if(match.length === 0)
    res.send("Could not found match");
  res.send(match);
})


router.get("/users/:userID/matches", async (req, res)=>{
  console.log("Come to here to get matches");
  const userID = req.params.userID;
  console.log(userID);
  const matches = await model.getMatchesByUserId(userID);
  console.log(matches);
  res.send(matches);
})


router.post('/finish/list', async (req, res) => {
  const user = req.body.ID;
  console.log("ID on api: " + user);
  const data = await model.getFinishRoomListByUserID(user);
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
