const express = require('express');
const router = express.Router();
const config = require("../config/default-config.json");
const model = require("../utils/sql-query");

/* GET PROFILE. */
router.get('/', async function(req, res, next) {
  const user = await model.getUserByID(req.user.user[0].ID);
  res.send(user);
});

router.post("/updateInformation", async (req,res) => {
  const user = req.user.user[0];
  const input = req.user.input;
  if(user.email !== input.newEmail){
    const sameEmail = await model.getUserByEmail(input.newEmail);
    if(sameEmail.length > 0){
      return res.status(400).send({
        message: "Email existed."
      })
    }
  }
  if(user.username !== input.newUsername){
    const sameUsername = await model.getUserByUsername(input.newUsername);
    if(sameUsername.length>0){
      return res.status(400).send({
        message: "Username exited."
      })
    }
  }

  user.username = input.newUsername;
  user.fullname = input.newFullname;
  user.email = input.newEmail;

  const updateInfor = await model.updateUser(user);
  console.log("User has updated: "+updateInfor);
  res.status(200).send({
    message: "Update information successfully."
  })
})

router.post("/updatePassword", async (req,res)=>{
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
  if(users.length === 0)
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
  if(user.length === 0)
    res.send("User is not found");
  res.send(user);
})

router.post("/users/:id/ban", async (req, res) => {
  const ID = req.params.id;
  const user = await model.banUser(ID);
  console.log(user);
  res.status(200).send("Update user success");

})

router.get("/matches", async (req,res ) => {

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

module.exports = router;
