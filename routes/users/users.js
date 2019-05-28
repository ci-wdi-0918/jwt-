var express = require('express');
var router = express.Router();
var passport = require('passport');

var userController = require('./controller/userController');

/* GET users listing. */
router.get('/', passport.authenticate('jwt', { session: false }), function(req, res, next) {
  res.send('Thanks for hitting this API');
});

router.post('/signupandlogin', function(req, res) {

  userController.signupAndLogIn(req.body)
                .then( user => {
                  res.json(user);
                })
                .catch( error => {
                  res.json(error);
                })

});

module.exports = router;
