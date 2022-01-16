const userService = require("../../service/user-service")
const userModel = require("../../models/user.model");

exports.checkEmailExist = async (req, res, next) => {
  const email = req.body.email;
  const result = await userService.checkEmailExists(email);
  res.json(result);
}

exports.updateUserInfo = async (req, res, next) => {
  const newUserInfo = { ...req.body };
  const result = await userModel.updateUserInfo(req.user._id, newUserInfo);
  // res.render("user/my-account", { message: result.message });
  res.json(result);
}

exports.changePassword = async (req, res, next) => {
  const { current_password, new_password } = req.body;
  let result = { status: false, message: "Change password failed" };

  if (await userService.checkCredential(req.user.email, current_password)) {
    if (await userModel.changePassword(req.user._id, new_password)) {
      result.status = true;
      result.message = "Password was changed";
    }
  } else {
    result.message = "Current password is not correct"
  }
  res.json(result);
}

exports.sendEmailResetPassword = async (req, res, next) => {
  const email = req.body.email;
  let result = { status: false, message: "Cannot send email" }

  const userInfo = await userModel.getActivedUserByEmail(email);

  if (userInfo) {
    if (await userService.sendEmailResetPassword(userInfo)) {
      result.status = true;
      result.message = "Email has sent"
    }
  } else {
    result.message = "Email does not exist"
  }

  res.json(result);
}

// exports.registerAccount = async (req, res, next) => {
//   const userInfo = req.body;
//   const result = await userModel.addNewAccount(userInfo);
//   res.json(result);
// }

// exports.resetPassword = async (req, res, next) => {
//   const { userId, password } = req.body;
//   const result = {status: false, message: "Reset password faild"}

//   if (await userModel.getActivedUserInfo(userId)) {
//     if (await userModel.changePassword(userId, password)) {
//       // res.render('user/login');
//       result.status = true;
//       result.message = "Reset password successfully";
//     }
//   }

//   // res.render('user/reset-password', { message: "Change password failed" })
//   res.json(result);
// }