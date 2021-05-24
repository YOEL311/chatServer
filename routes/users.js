var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

// app.post('/auth', async (req, res) => {
//   const user_id = req.body.user_id;
//   console.log('user ID: ', user_id);
//   if (!user_id) {
//     return res.status(400);
//   }

// return res.send({
//   token: server_side_client.createToken(user_id),
// });
// });

module.exports = router;
