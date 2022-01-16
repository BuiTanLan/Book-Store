var express = require('express');
var router = express.Router();

const IndexController = require('../controllers/index.controller')

/* GET home page. */
router.get('/', IndexController.getHomePage);

router.get('/login', IndexController.getLoginPage);

router.get('/register', IndexController.getRegisterPage);

router.get('/*', IndexController.getWrongPage);

module.exports = router;