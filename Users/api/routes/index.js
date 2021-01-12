const cryptoRandomString = require('crypto-random-string');

var express = require('express');
const router = express.Router();
const model = require("../utils/sql_command");
const MailTemplate = require("../utils/mailTemplate");
const bcrypt = require('bcrypt');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post("/activeAccount/:uuid", async (req, res) => {
  console.log("hash link: "+ req.params.uuid);
  const user = await model.activeUser(req.params.uuid);
  console.log(user);
  await model.updateVerrifyPage(req.params.uuid);
  res.send(user);
})

router.post("/forgotPass/", async (req, res) => {
  const email = req.body.email;
  const user = await model.getUserByEmail(email);
  console.log(user[0]);
  if(user[0] !== undefined &&user[0].ID.length !== 0 && user[0].email.length !== 0){
    const hashLink = cryptoRandomString({ length: 40, type: 'base64' });
    await model.saveHashLinkToPageVerrify(user[0].ID, hashLink);
    MailTemplate.forgotPassword(hashLink, email);
    res.status(200).send("Sent mail successfully");
  }
  else res.status(404).send(({message: "Email is not found."}));
})

router.post("/resetPassword/:uuid", async (req, res) => {
  const newPassword = req.body.newPassword;
  const hash = bcrypt.hashSync(newPassword, 10);
  const userId = await model.getUserIdByUUID(req.params.uuid);
  await model.resetPassword(userId[0].userId, hash);
  await model.updateVerrifyPage(req.params.uuid);
  res.sendStatus(200);
})

module.exports = router;