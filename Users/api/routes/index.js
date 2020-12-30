const cryptoRandomString = require('crypto-random-string');

var express = require('express');
const router = express.Router();
const model = require("../utils/sql_command");
const MailTemplate = require("../utils/mailTemplate");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post("/activeAccount/:uuid", async (req, res) => {
  console.log("hash link: "+ req.params.uuid);
  const user = await model.activeUser(req.params.uuid);
  await model.updateVerrifyPage(req.params.uuid);
  res.send(user);
})

router.post("/forgotPass/", async (req, res) => {
  console.log("Email: "+ req.body.email);
  console.log("Username: "+ req.body.username);
  const username = req.body.username;
  const email = req.body.email;
  const A = await model.getUserByEmail(email);
  console.log(user);
  console.log(user.ID);
  console.log(user.email)
  if(user.ID.length !== 0 && user.email.length !== 0){
    console.log("Before crypt")
    const hashLink = cryptoRandomString({ length: 40, type: 'base64' });
    await model.saveHashLinkToPageVerrify(user.ID, hashLink);
    MailTemplate.forgotPassword(hashLink, user.email);
  }
  res.send("Sent");
})

router.post("/resetPassword/:uuid", async (req, res) => {
  const newPassword = req.body.newPassword;
  const hash = bcrypt.hashSync(newPassword, 10);
  const userId = await model.getUserIdByUUID(req.params.uuid);
  console.log(userId);
  await model.resetPassword(userId, hash);
  res.sendStatus(200);
})

module.exports = router;