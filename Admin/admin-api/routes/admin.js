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

})

router.post("/users/:email", async (req, res) => {

})

router.get("/users/:userId", async (req,res) => {

})

router.post("/users/:id/ban", async (req, res) => {

})

router.get("/matches", async (req,res ) => {

})

router.get("/matches/:uuidMatch", async (req,res ) => {

})
module.exports = router;
