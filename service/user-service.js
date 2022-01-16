const User = require('../databases/user')
const bcrypt = require('bcrypt')
const nodemailer = require('nodemailer')

const saltRounds = 10;

exports.checkCredential = async (username, password) => {
  const user = await User.findOne({ email: username, status: "Active" })
  if (!user) {
    return false;
  }
  // console.log("USER: ", user);
  let checkPassword = await bcrypt.compare(password, user.password);
  if (checkPassword) {
    return user;
  }
  return false;
}

exports.hashPassword = async (password) => {
  // const saltRounds = 10;
  let hashedPassword = ""
  try {
    const salt = await bcrypt.genSalt(saltRounds);
    hashedPassword = await bcrypt.hash(password, salt)
  } catch (err) {
    console.log("Error hash password", err)
  }

  return hashedPassword;
}

exports.hashPasswordAndCreateNewAccount = async (newUser) => {
  let userRes = {}
  try {
    const salt = await bcrypt.genSalt(saltRounds);
    // console.log("hash: ", hash);
    const hashedPassword = await bcrypt.hash(newUser.password, salt)
    // console.log("hash: ", hashResult)
    userRes = await User.create({ ...newUser, password: hashedPassword })
  } catch (err) {
    console.log("Error hash password", err)
  }

  return userRes;
}

exports.sendEmailResetPassword = async (userInfo) => {
  const PORT = process.env.PORT || 3000;
  // const host = `http://localhost:${PORT}`;
  const host = 'https://techiegang.herokuapp.com';
  // // console.log(host);
  const link = host + "/users/reset-password?id=" + userInfo._id;
  const message = {
    from: process.env.MAIL_USERNAME,
    to: userInfo.email,
    subject: "BookStore - Reset password",
    text: link,
    html: "<p>To reset your password, <a href='" + link + "'>click me</a></p>",
  };
  console.log("Message: ", message);

  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAIL_USERNAME || "technigang007@gmail.com",
      pass: process.env.MAIL_PASSWORD || "3besthandsomeguy"
    }
  });
  // send mail with defined transport object
  try {
    let info = await transporter.sendMail(message);
    return true;
  } catch (error) {
    console.log("Error send email: ", error)
    return false;
  }
}

exports.checkEmailExists = async (email) => {
  const isExists = await User.exists({ email: email });
  return isExists;
}