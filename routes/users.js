var express = require("express");
const passport = require("passport");
var router = express.Router();
const userController = require("../controllers/user.controller");
const { authNotLogin, isAuthenticated } = require('../middlewares/auth.mdw');

/* GET home page. */
router.get("/", isAuthenticated, userController.getAccountInfo);

router.get("/login", authNotLogin, userController.login);

router.post("/login", authNotLogin, userController.postLogin);
router.post("/login", authNotLogin,
  passport.authenticate("local",
    {
      successRedirect: "/",
      failureRedirect: "/login",
      failureFlash: true
    })
);



router.get("/register", authNotLogin, userController.register);
router.post("/register", authNotLogin, userController.addNewAccount);

router.get("/logout", userController.logout);


router.get("/forgot-password", userController.renderForgotPasswordScreen)
// router.post("/forgot-password", userController.sendEmailResetPassword)

router.get("/reset-password", userController.renderNewPasswordScreen)
router.post("/reset-password", userController.resetPassword)

router.get("/order", isAuthenticated, userController.renderOrderHistory)

// router.post("/update-account", isAuthenticated, userController.updateUserInfo)
// router.post("/change-password", isAuthenticated, userController.changePassword)

module.exports = router;