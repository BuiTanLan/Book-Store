const passport = require("passport");
const billModel = require("../models/bill.model");

const userModel = require("../models/user.model");
const userService = require("../service/user-service")

const dateFormat = require('dateformat')

module.exports = {
  getAccountInfo: (req, res, next) =>
    res.render("user/my-account", { title: "Express" }),

  checkLogin: async (req, res, next) => {
    const password = req.body.password;
    const email = req.body.email;
    console.log(email);
    console.log(password);

    const loginStatus = await userModel.login(email, password);
    console.log("checkLogin", "loginStatus", loginStatus);
    if (loginStatus === 1) {
      res.redirect("/");
    } else {
      res.render("user/login", { error: true });
    }
  },

  login: (req, res, next) => {
    res.render("user/login");
  },

  postLogin: async (req, res, next) => {
    passport.authenticate("local", async function (err, user, info) {
      if (err) { return next(err); }
      if (!user) { return res.redirect('/login'); }

      req.logIn(user, async function (err) {
        if (err) return next(err);

        //update cart after login
        if (req.session.cart && req.session.cart.length > 0) {
          await userModel.updateCartAfterLogin(user._id, req.session.cart);
          req.session.cart = [];
        }

        return res.redirect('/');
      });

    })(req, res, next);
  },

  register: (req, res, next) => res.render("user/register"),

  addNewAccount: async (req, res, next) => {
    const userInfo = req.body;
    const result = await userModel.addNewAccount(userInfo);

    res.redirect('/login')
  },

  logout: (req, res, next) => {
    req.logout();
    // req.session.cart = []
    res.redirect("/");
  },

  verifyEmail: async (req, res, next) => {
    const id = req.query.id;
    const email = req.query.email;
    // console.log("vertify", "id", id);
    const result = await userModel.verifyEmail(email, id);

    let message = ""
    if (result) {
      message = "Verify email successfully!"
    } else {
      message = "Something went wrong. Verify email failed!"
    }
    res.render('user/verify', { message })
  },

  renderForgotPasswordScreen: (req, res, next) => {
    res.render('user/forgot-password')
  },

  // sendEmailResetPassword: async (req, res, next) => {
  //   //send email
  //   const email = req.body.email;

  //   const userInfo = await userModel.getActivedUserByEmail(email);
  //   if (userInfo) {
  //     const result = await userService.sendEmailResetPassword(userInfo)
  //     if (result) {
  //       res.send("Email has sent")
  //     } else {
  //       res.render('user/forgot-password', { message: "Error while sending email" })
  //     }
  //   } else {
  //     res.render('user/forgot-password', { message: "Email does not exist" })
  //   }
  // },

  renderNewPasswordScreen: async (req, res, next) => {
    // const email = req.query.email;
    const id = req.query.id;

    const result = await userModel.getActivedUserInfo(id);
    // console.log(result);

    if (result) {
      res.render('user/reset-password', { id })
    }
    else {
      next()
    }
  },

  resetPassword: async (req, res, next) => {
    const { userId, password } = req.body;
    // const userInfo = await userModel.getActivedUserInfo(userId);

    if (await userModel.getActivedUserInfo(userId)) {
      if (await userModel.changePassword(userId, password)) {
        res.render('user/login', { message: "Reset password successfully" });
      }
    }
    res.render('user/reset-password', { message: "Change password failed" })
  },

  renderOrderHistory: async (req, res, next) => {
    const bills = await billModel.getBillByUser(req.user._id);

    let result = [];
    for (let bill of bills) {
      let bookNames = [];
      for(let book of bill.books) {
        bookNames.push(book.bookId.name);
      }

      result.push({
        _id: bill._id,
        books: bookNames.join(', '),
        booking_date: dateFormat(bill.booking_date, "dd/mm/yyyy"),
        total_price: bill.total_price,
        status: bill.status
      });
    }

    console.log(result);


    // res.render
    res.render('bill/bill-history', { result })
    // res.send(result);
  }

};
