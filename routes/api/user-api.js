var express = require("express");
var router = express.Router();

const { isAuthenticated } = require('../../middlewares/auth.mdw');
const userApiController = require("../../controllers/api/user-api-controller");


router.post("/check-email-exist", userApiController.checkEmailExist)

router.post("/update-user-info", isAuthenticated, userApiController.updateUserInfo)

router.post("/change-password", isAuthenticated, userApiController.changePassword)


// router.post("/register-account", userApiController.registerAccount)



module.exports = router;
