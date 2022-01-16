const nodemailer = require("nodemailer");

const User = require("../databases/user");
const userService = require("../service/user-service");
const cartService = require("../service/cart-service");
const { findOneAndUpdate } = require("../databases/user");

//function
async function checkEmailExists(email) {
  const isExists = await User.exists({ email: email });
  return isExists;
}

//return 1 if vaild
async function checkPassword(email, password) {
  for (account of accounts) {
    if (account.email === email && account.password === password) {
      return 1;
    }
  }
  return 0;
}

// var hashPwd = function hashPwd(salt, pwd) {
//   var hmac = crypto.createHmac("sha256", salt);
//   return hmac.update(pwd).digest("hex");
// };

module.exports = {
  getActivedUserInfo: async (id) => {
    const usrData = await User.findOne({ _id: id, status: "Active" });
    return usrData;
  },
  getActivedUserByEmail: async (email) => {
    const usrData = await User.findOne({ email: email, status: "Active" });
    return usrData;
  },
  getAllUser: async () => {
    const allUser = await User.find({ show: true }).exec();
    console.log(allUser);
    return allUser;
  },

  addNewAccount: async (accountInfo) => {
    const newUser = { ...accountInfo };
    console.log("User info: ", newUser);

    if (await checkEmailExists(accountInfo.email)) {
      console.log("addNewAccount.", "Email has been used");
      return { status: false, message: "Email is already used" };
    }

    //hash password
    const userRes = await userService.hashPasswordAndCreateNewAccount(newUser);

    // //send mail
    // const PORT = process.env.PORT || 3000
    // // const host = `http://localhost:${PORT}`;
    // const host = 'https://techiegang.herokuapp.com';
    // // // console.log(host);
    // const link = host + "/users/verify?id=" + userRes._id + "&email=" + userRes.email;
    // const message = {
    //   from: process.env.MAIL_USERNAME || "technigang007@gmail.com",
    //   to: userRes.email,
    //   subject: "BookStore - Verify your account",
    //   text: link,
    //   html: "<p>To verify your BookStore account, <a href='" + link + "'>click me</a></p>",
    // };
    // console.log("Message: ", message);

    // let transporter = nodemailer.createTransport({
    //   // service: "gmail",
    //   host: 'smtp.gmail.com',
    //   port: 587,
    //   auth: {
    //     user: process.env.MAIL_USERNAME || "technigang007@gmail.com",
    //     pass: process.env.MAIL_PASSWORD || "3besthandsomeguy"
    //   }
    // });
    // // send mail with defined transport object
    // try {
    //   let info = await transporter.sendMail(message);
    //   // console.log("Message sent: %s", info.messageId);
    // } catch (error) {
    //   console.log("Error send email: ", error)
    //   return { status: false, message: "Can not send email" }
    // }

    return { status: true, message: "Register successfully" };
  },

  register: async (user) => {
    console.log(user);
    const res = await User.create(user);
    return res;
  },

  login: async (usr, pwd) => {
    const isEmailExists = await checkEmailExists(usr);
    if (isEmailExists) {
      // const usrData = await User.findOne({ email: usr, show: true });
      // console.log("Login", "userData", usrData);
      // console.log("login", "salt", usrData.salt);
      // console.log("login", "pwd", pwd);
      // const pass = hashPwd(usrData.salt, pwd);
      // console.log("login", "pass", pass);
      // if (usrData.password === pass) {
      //   return 1;
      // } else {
      //   return 0;
      // }
    }
    return -1;
  },

  verifyEmail: async (email, id) => {
    const query = { _id: id, email: email, status: "Pending" };
    let result = false;

    try {
      await User.findOneAndUpdate(query, { status: "Active" });
      result = true;
    } catch (error) {
      console.log("Error: verify email failed, cannot update account status to \"Active\"");
    }
    return result;
  },

  changePassword: async (userId, newPassword) => {
    let result = false;

    const query = { _id: userId, status: "Active" };
    const hashedPassword = await userService.hashPassword(newPassword);

    if (hashedPassword) {
      try {
        await User.findOneAndUpdate(query, { password: hashedPassword });
        result = true;
      } catch (error) {
        console.log("userModel/changePassword: change password failed -> ", error);
      }
    }
    return result;
  },

  updateUserInfo: async (userId, info) => {
    let result = { status: false, message: "" };

    const query = { _id: userId, status: "Active" }
    try {
      await User.findOneAndUpdate(query, { ...info });
      result.status = true;
      result.message = "Updated successfully!"
    } catch (error) {
      result.message = "Cannot update user info"
    }

    return result;
  },

  addBookToCart: async (userId, goods) => {
    let result = { status: false, message: "Failed" }

    const query = { _id: userId, status: "Active" }
    try {
      const user = await User.findOne(query);
      if (user) {
        // check if book is already exists in cart
        let isExists = false;
        for (let g of user.cart) {
          if (g.bookId.toString() === goods.bookId) {

            isExists = true;
            g.amount += goods.amount;
            break;
          }
        }
        // if book is not exists in cart
        if (!isExists) {
          user.cart.push(goods);
        }
        await user.save();

        result.status = true;
        result.message = "Successfully!"
      }
    } catch (error) {
      result.message = "Server error"
    }

    return result;
  },

  updateCartAfterLogin: async (userId, cart) => {
    const query = { _id: userId, status: "Active" };
    return await User.findOneAndUpdate(query, { cart: cart }, { new: true });
  },

  getCartDetail: async (userId) => {
    let result = { status: false, message: "Server error" };
    try {
      const user = await User.findOne({ _id: userId })
        .populate({
          path: 'cart',
          populate: {
            path: 'bookId',
            model: 'Book'
          }
        })
        .exec();

      console.log("User: ", user)
      let totalPrice = 0;
      for (const goods of user.cart) {
        totalPrice += goods.bookId.price * goods.amount;
      }

      result.status = true;
      result.message = "OK"
      result.data = { cart: user.cart, totalPrice };
    } catch (e) {
      console.log("userModel/getCartDetail: ", e.toString());
    }
    return result;
  },

  updateGoodsAmount: async (userId, goods) => {
    const result = { status: false, message: "Update goods amount failed" }
    const query = { _id: userId, status: "Active" };

    try {
      const user = await User.findOne(query)
        .populate({
          path: 'cart',
          populate: {
            path: 'bookId',
            model: 'Book'
          }
        })
        .exec();
      if (user) {
        for (const g of user.cart) {
          if (g.bookId._id.toString() === goods.bookId) {
            g.amount = goods.amount;
            break;
          }
        }
        await user.save();

        const totalPrice = cartService.totalPrice(user.cart);
        result.status = true;
        result.message = "Update goods amount successfully"
        result.data = { cart: user.cart, totalPrice: totalPrice };
      }
    } catch (e) {
      console.log("userModel/updateGoodsAmount: ", e.toString());
    }

    return result;
  },

  deleteProductFromCart: async (userId, bookId) => {
    const query = { _id: userId, status: "Active" };
    try {
      const user = await User.findOne(query);
      if (user) {
        for (let i = 0; i < user.cart.length; i++) {
          if (user.cart[i].bookId.toString() === bookId) {
            user.cart.splice(i, 1);
            break;
          }
        }
        await user.save();
      }
    } catch (e) {
      console.log("userModel/deleteProductFromCart: ", e.toString());
    }
  },

  clearCart: async (userId) => {
    const query = { _id: userId, status: "Active" };
    await User.findOneAndUpdate(query, { cart: [] });
  }

};
