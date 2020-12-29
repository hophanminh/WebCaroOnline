var express = require('express');
const router = express.Router();
const model = require("../utils/sql_command");

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

module.exports = router;